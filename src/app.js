import {
    Terminal
} from 'xterm';

const terminalPrefix = "\u001b[1;3;31mxterm\u001b[0m $ ";
const $terminal = document.getElementById('terminal');

const term = new Terminal({
    cursorBlink: true,
    rows: 15
});

term.prompt = function () {
    term.write('\r\n' + terminalPrefix);
};

term.open($terminal);
term.writeln('Welcome to xterm.js');
term.writeln('Type some keys and commands to play around.');
// term.write(terminalPrefix);
term.prompt();


term.on('key', function (key, ev) {
    var printable = (!ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey);
    var kc = ev.keyCode;
    
    if (kc == 13) {
        term.prompt();
    } else if (kc == 8) {
        // remove previous character when backspace pressed
        term.write('\b \b');
    } else if (printable) {
        term.write(key);
    }
});