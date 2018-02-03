import {
    Terminal
} from 'xterm';
import * as vm from 'vm';

let line_inputs = [];

const terminalPrefix = "\u001b[1;3;31mxterm\u001b[0m $ ";
const $terminal = document.getElementById('terminal');

// terminal instance
const term = new Terminal({
    cursorBlink: true,
    rows: 15
});

// re-useable terminal prefixer as terminal prompt
term.prompt = () => {
    term.write('\r\n' + terminalPrefix);
};

// opening terminal and initilize default text
term.open($terminal);
term.writeln('Welcome to Web Terminal');
term.prompt();

// let res = vm.runInNewContext('a + 5', { a : 100 });
// vm.runInNewContext('console.log("Hello")');

// terminal key input event
term.on('key', (key, ev) => {
    let printable = (!ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey),
        kc = ev.keyCode;

    // console.log(kc, key)

    if (kc == 13) {
        // Enter: re initilize line input array and show terminal prefixer
        return line_inputs = [], term.prompt();
    } else if (kc == 8) {
        // Backspace: remove previous character when key pressed
        return line_inputs.length !== 0 ? term.write('\b \b') : false, line_inputs.pop();
    } else if (printable) {
        // print the key and putting in the line inputes array
        return line_inputs.push(key), term.write(key);
    }
});