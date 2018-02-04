var path = require('path'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(80);

app.use(express.static('public'));
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

const port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000  
app.listen(port, function () {
    console.log("Express server listening on port %d", port);
});