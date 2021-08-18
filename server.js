const path = require('path');
const exec = require('child_process').exec;
const express = require('express');
const io = require('socket.io')(8080);

const app = express();

app.use(express.static('public'))
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', '/index.html'));
});

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

const port = process.env.PORT || 3000; // Use the port that Heroku provides or default to 5000  
app.listen(port, function () {
    console.log("Server listening on port : %d", port);
});