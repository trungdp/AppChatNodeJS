var path = require("path");
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongodb = require('./Database/MongoDB');
var user = require('./Model/User');
var message = require('./Model/Message');
var fs = require('fs');
const Conversation = require("./Model/Conversation");
var onlineUsers = [];

//Chỉ ra đường dẫn chứa css, js, images...
app.use(express.static(path.join(__dirname, 'Client')));
app.set("view engine", "ejs");
app.set("views", "./views");

let rooms = [{ name: "Phòng 1", userCount: 0 },
    { name: "Phòng 2", userCount: 0 },
    { name: "Phòng 3", userCount: 0 }
];
var usernameCount = 0;
//Tạo socket 
app.get("/", function(req, res) {
    res.render("index");
});

io.set('transports', ['websocket']);

io.on('connection', function(socket) {
    console.log('socket ' + socket.id + ' is connected');

    socket.on('signin', function(data) {
        mongodb.isValidateUser({ name: data.name, pass: data.pass }, function(result) {
            if (result) {
                socket.emit("signinSuccess", result);
                socket.userName = result.name;
                socket.idUser = result._id.toString();
                console.log("id: "+socket.idUser+" name: "+socket.userName);
                mongodb.updateStatus(data.name, require('./src/define').userStatus.ONLINE, (res) => {
                    sendOnlineUser();
                })
            } else {
                socket.emit('signinError', "Tên đăng nhập hoặc mật khẩu không đúng");
            }
        });
    });

    socket.on('signup', function(data) {
        mongodb.hadName(data.name, function(result) {
            if (result) {
                const errorMessage = "Tên người dùng đã tồn tại!";
                socket.emit('signupError', errorMessage);
            } else {
                mongodb.addUser(data, () => {
                    socket.emit('signupSuccess', result);
                })
            }
        });
    });

    socket.on('disconnect', function() {
        if (socket.userName){
            mongodb.updateStatus(socket.userName, require('./src/define').userStatus.OFFLINE, (res) => {
                sendOnlineUser();
            })
        }
    });

    //room handle---------------------------------------------
    socket.on('getConversation', (data) => {
        getConversation(socket.idUser, data, (res) => {
            joinRoom(socket, res._id);
            socket.emit('resConversation', res);
            console.log('room: ' + res._id);
        })
    });

    socket.emit('roomOrder', rooms);
    socket.on('joinRoom', (data)=>{
        joinRoom(socket, data);
    })
    socket.on('sendPeerID', id => {
        socket.peerID = id
        console.log("peerID " + socket.peerID);
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

var sendOnlineUser = () => {
    mongodb.getAllOnlineUser((listUserName) => {
        io.sockets.emit('onlineUser', listUserName);
        console.log("list online user: " + listUserName);
    });
}
var getConversation = (id, idTarget, callback) => {
    mongodb.findRoom([id, idTarget], (res) => {
        if (res) return callback(res);
        return mongodb.createRoom(new Conversation([id, idTarget]), (res) => {
            return callback(res);
        });
    });
}
var joinRoom = (socket, data) => {
    var roomName = data;

    socket.join("room-" + roomName);
    console.log(socket.request.connection.remoteAddress + " joined to " + roomName);

    socket.on('send', function(data) {
        if (data.type === "text") {
            console.log(data.username + ": " + data.object);
        }
        io.sockets.in("room-" + roomName).emit('send', data);
    });

    socket.on('callVideo', function() {
        socket.to('room-' + roomName).emit('callVideo');
    });
    socket.on('answerID', function(id) {
        socket.to('room-' + roomName).emit('answerID', id);
    });
}




server.listen(process.env.PORT || 3000);