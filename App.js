var path = require("path");
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//Chỉ ra đường dẫn chứa css, js, images...
app.use(express.static(path.join(__dirname, 'Client')));

//Tạo router
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + '/Client/index.html'));
});

//Tạo socket 
io.on('connection', function (socket) {
    console.log('Welcome to server chat');

    socket.on('send', function (data) {
        io.sockets.emit('send', data);
    });
});

//Khởi tạo 1 server listen tại 1 port
server.listen(3000);