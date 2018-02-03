import {
    Terminal
} from 'xterm';

const terminalPrefix = "\u001b[1;3;31mxterm\u001b[0m $ ";
const $terminal = document.getElementById('terminal');

const term = new Terminal({
    cursorBlink: true,
    rows: 15
});

let line_inputs = [];

term.prompt = () => {
    term.write('\r\n' + terminalPrefix);
};

term.open($terminal);
term.writeln('Welcome to Web Terminal');
term.prompt();

term.on('key', (key, ev) => {
    let printable = (!ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey), 
        kc = ev.keyCode;

    console.log(kc, key)

    if (kc == 13) {
        return line_inputs = [] , term.prompt();
    } else if (kc == 8) {
        // remove previous character when backspace pressed
        return line_inputs.length !== 0 ? term.write('\b \b') : false, line_inputs.pop();
    } else if (printable) {
        return line_inputs.push(key) , term.write(key);
    }
});