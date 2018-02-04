import {
    Terminal
} from 'xterm';
import io from 'socket.io-client';

let line_inputs = [],
    history = [],
    upDownKeyPressedCount = -1;

const terminalPrefix = `\u001b[1;3;31mwebTerminal\u001b[0m${String.fromCodePoint(0x026A1)} `,
    $terminal = document.getElementById('terminal'),
    term = new Terminal({
        cursorBlink: true,
        rows: 15
    }),
    socket = io('http://localhost');

// re-useable terminal prefixer as terminal prompt
term.prompt = () => {
    term.write('\r' + terminalPrefix + ' ');
};

term.newLineprompt = () => {
    term.write('\r\n' + terminalPrefix + ' ');
};

// opening terminal and initilize default text
term.open($terminal);
term.writeln('Welcome to Web Terminal');
term.newLineprompt();

socket.on('connect', function () {
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
            return line_inputs = [], term.prompt();
        }
    });
});

socket.on('disconnect', function () {
    console.log("Client socket disconnect");
});

// terminal key input event
term.on('key', (key, ev) => {
    const printable = (!ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey),
        kc = parseInt(ev.keyCode);

    if (kc === 13) {
        const input = line_inputs.join('').toString();
        history.push(input);
        if (input === 'clear' || input === 'cls') {
            return term.reset(), term.prompt(), line_inputs = [];
        } else if (input === 'history') {
            term.newLineprompt();
            return term.write(history.join(', ')), term.newLineprompt();
        } else {
            return socket.emit('message', {
                exec: input
            });
        }
    } else if (kc === 46 || kc === 35 || kc === 36) {
        // DELETE: 46, END: 35, HOME: 36, INSERT: 45, '-': 45
        return true;
    } else if (kc === 37 || kc === 38 || kc === 39 || kc === 40) {
        // upArrow > 38 , downArrow > 40
        if (parseInt(upDownKeyPressedCount) >= parseInt(history.length)) {
            upDownKeyPressedCount = parseInt(history.length - 1);
        } else if (parseInt(upDownKeyPressedCount) < 0) {
            upDownKeyPressedCount = 0;
        } else {}

        if (kc === 38) {
            // up history
            if (history.length > 0) {
                const value = history[upDownKeyPressedCount];
                return line_inputs = value.split(''), term.prompt(), term.write(value), upDownKeyPressedCount++;
            }
        } else if (kc === 40) {
            // down history
            if (history.length > 0) {
                const value = history[upDownKeyPressedCount];
                return line_inputs = value.split(''), term.prompt(), term.write(value), upDownKeyPressedCount--;
            }
        } else {
            // prevent left-right arrow
            return true;
        }
    } else if (kc === 8) {
        // Backspace: remove previous character when key pressed
        return line_inputs.length !== 0 ? term.write('\b \b') : false, line_inputs.pop();
    } else if (printable) {
        // print the key and putting in the line inputes array
        return line_inputs.push(key), term.write(key);
    }
});