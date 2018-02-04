const exec = require('child_process').exec;
const io = require('socket.io')(80);

io.on('connection', function (socket) {
    socket.emit('terminal', {
        sys: 'Server connected'
    });

    socket.on('message', function (data) {
        if (data['exec']) {
            exec(data['exec'], function (error, stdout, stderr) {
                // command output is in stdout
                socket.emit('terminal', {
                    error,
                    stdout,
                    stderr
                });
            });
        }
    });

    socket.on('disconnect', function () {
        console.log("Socket disconnect");
    });
});