var path = require("path");
var express = require("express");
var app = express();
// var server = require('https').createServer(app);
var io = require('socket.io')(app);
var mongodb = require('./Database/MongoDB');
var user = require('./Model/User');
var message = require('./Model/Message');
var fs = require('fs');
const Conversation = require("./Model/Conversation");

//Chỉ ra đường dẫn chứa css, js, images...
app.use(express.static(path.join(__dirname, 'Client')));
app.set("view engine","ejs");
app.set("views","./views");

let rooms = [{ name: "Phòng 1", userCount: 0 },
             { name: "Phòng 2", userCount: 0 },
             { name: "Phòng 3", userCount: 0 }];
var usernameCount = 0;
//Tạo socket 
app.get("/", function (req, res) {
    res.render("login");
});
app.get("/index", function (req, res) {
    res.render("index",{text:"1234567890"});
    //var name = req.url.query.name;
    //console.log(name);
});

io.on('connection', function (socket) {
    console.log('Connected');

    socket.on('signin', function (data) {
        mongodb.isValidateUser(data, function (result) {
            console.log(result);
            socket.emit('signin', result);
            user = result;
        });
    });

    //room handle---------------------------------------------
    roomOrder(socket);
    socket.on('joinRoom', (data) => {
        var roomName = data;

        socket.join("room-" + roomName);
        console.log(socket.request.connection.remoteAddress + " joined to " + roomName);

        socket.on('send', function (data) {
            console.log(data.name + ": " + data.object);
            io.sockets.in("room-" + roomName).emit('send', data);
        });
    });
    socket.on('leaveRoom', (data) => {
        socket.leave("room-" + data);
        console.log(socket.remoteAddress + " left " + data);
    });
    socket.on('createRoom', (data) => {
        rooms.push({
            name: data,
            userCount: 0
        });
        console.log("created room");
        roomOrder(socket);
    });
});

var roomOrder = (socket) => {
    socket.emit('roomOrder', rooms);
}
mongodb.useTable("Conversation");
var conversation = new Conversation(["abc", "123"].sort());
mongodb.findRoom(["abc", "1234"], function (id) {
    console.log(id);
})
app.listen(process.env.PORT || 443);