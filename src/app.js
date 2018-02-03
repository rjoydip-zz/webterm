import {
    Terminal
} from 'xterm';

const terminalPrefix = "\u001b[1;3;31mxterm\u001b[0m $ ";
const $terminal = document.getElementById('terminal');

const term = new Terminal({
    cursorBlink: true,
    rows: 15
});

term.open($terminal);
term.write(terminalPrefix);

term.textarea.onkeydown = (e) => {
    const keyCode = parseInt(e.keyCode);

    // get key modified state
    const caps = event.getModifierState && event.getModifierState('CapsLock');
    const shift = event.getModifierState && event.getModifierState('Shift');
    const alt = event.getModifierState && event.getModifierState('Alt');
    const tab = event.getModifierState && event.getModifierState('Tab');

    const char = caps || shift ? e.key.toString().toUpperCase() : e.key.toString().toLowerCase();

    if (keyCode === 18 || keyCode === 20 || keyCode === 9 || keyCode === 16) {
        e.preventDefault();
        return false;
    }

    if (keyCode === 8) {
        console.log("Backspace");
        return false;
    }

    // new line by pressed 'Enter' key
    if (keyCode === 13) {
        return term.write(terminalPrefix);
    }

    return term.write(char);
}