var path = require("path");
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongodb = require('./Database/MongoDB')

//Chỉ ra đường dẫn chứa css, js, images...
app.use(express.static(path.join(__dirname, 'Client')));

//Tạo router
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + '/Client/login.html'));
});

//Tạo socket 
io.on('connection', function (socket) {
    console.log('Welcome to server chat');

    socket.on('send', function (data) {
        io.sockets.emit('send', data);
    });
});

mongodb.connect();
mongodb.createTable("User");
var obj1 = {name: "trung",pass: "1"};
var obj2 = {name: "vu",pass: "2"};
var obj3 = {name: "quan",pass: "3"};
mongodb.insert([obj1,obj2,obj3],"User");

//Khởi tạo 1 server listen tại 1 port
server.listen(3000);