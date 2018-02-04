import {
    Terminal
} from 'xterm';
import io from 'socket.io-client';

let line_inputs = [];
const terminalPrefix = "\u001b[1;3;31mwTerm\u001b[0m $ ";
const $terminal = document.getElementById('terminal');

// terminal instance
const term = new Terminal({
    cursorBlink: true,
    rows: 15
});
const socket = io('http://localhost');

// re-useable terminal prefixer as terminal prompt
term.prompt = () => {
    term.write('\r' + terminalPrefix);
};
term.newLineprompt = () => {
    term.write('\r\n' + terminalPrefix);
};

// opening terminal and initilize default text
term.open($terminal);
term.writeln('Welcome to Web Terminal');
term.prompt();

socket.on('connect', function () {
    console.log("Client socket disconnect");
    socket.on('terminal', function (data) {
        socket.emit('message', {
            sys: 'Client connected'
        });

        if (!data['sys']) {
            term.newLineprompt();
            if (data['error'] === null && data['stderr'] === '') {
                term.write(data['stdout']);
            } else {
                term.write(data['stderr']);
            }
            // Enter: re initilize line input array and show terminal prefixer
            return line_inputs = [], term.write('\r' + terminalPrefix);
        }
    });
});

socket.on('disconnect', function () {
    console.log("Client socket disconnect");
});

console.log(__dirname, __filename);

// terminal key input event
term.on('key', (key, ev) => {
    let printable = (!ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey),
        kc = ev.keyCode;

    if (kc == 13) {
        if (line_inputs.join('').toString() === 'clear' || line_inputs.join('').toString() === 'cls') {
            console.log("Clear");
            return term.reset(), term.prompt();
        }
        socket.emit('message', {
            exec: line_inputs.join('')
        });
    } else if (kc == 8) {
        // Backspace: remove previous character when key pressed
        return line_inputs.length !== 0 ? term.write('\b \b') : false, line_inputs.pop();
    } else if (printable) {
        // print the key and putting in the line inputes array
        return line_inputs.push(key), term.write(key);
    }
});