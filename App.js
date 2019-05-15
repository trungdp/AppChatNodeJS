var path = require("path");
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongodb = require('./Database/MongoDB');
var user = require('./Model/User');
var message = require('./Model/Message');
var fs = require('fs');
var myInfo = new user();

//Chỉ ra đường dẫn chứa css, js, images...
app.use(express.static(path.join(__dirname, 'Client')));

let rooms = [{ name: "Phòng 1", userCount: 0 }, { name: "Phòng 2", userCount: 0 }, { name: "Phòng 3", userCount: 0 }];
var usernameCount = 0;
//Tạo socket 
io.on('connection', function(socket) {
    console.log('Connected');

    socket.on('signin', function(data) {
        mongodb.isValidateUser(data, function(result) {
            console.log(result);
            socket.emit('signin', result.name != "");
            user = result;
        });
    });

//room handle---------------------------------------------
    roomOrder(socket);
    socket.on('joinRoom', (data) => {
        var roomName = data;

        socket.join("room-" + roomName);
        console.log(socket.remoteAddress + " joined to " + roomName);

        socket.on('send', function(data) {
            console.log(data.name + ": " + data.object);
            io.sockets.in("room-" + roomName).emit('send', data);
        });
    });
    socket.on('leaveRoom', (data) => {
        socket.leave("room-" + data);
        console.log(socket.remoteAddress + " left " + data);
    });
    socket.on('createRoom', (data) => {
        rooms.push({ name: data, userCount: 0 });
        console.log("created room");
        roomOrder(socket);
    });
});

var roomOrder = (socket) => {
    socket.emit('roomOrder', rooms);
}

mongodb.connect();
mongodb.createTable("User");
var obj1 = { name: "trung", pass: "1" };
var obj2 = { name: "vu", pass: "2" };
var obj3 = { name: "quan", pass: "3" };
mongodb.insert([obj1, obj2, obj3], "User");
server.listen(3000);