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
    res.render("index");
});

io.on('connection', function (socket) {
    console.log(socket.id + 'Connected');

    socket.on('signin', function (data) {
        mongodb.isValidateUser({name: data.name, pass: data.pass}, function (result) {
            if(result){
                socket.emit("signinSuccess",result);
                socket.userName = data.name;
                mongodb.updateStatus(data.name,require('./src/define').userStatus.ONLINE,(res)=>{
                    sendOnlineUser();
                })
            } else {
                socket.emit('signinError', "Tên đăng nhập hoặc mật khẩu không đúng");
            }
        });
    });

    socket.on('disconnect', function (data) {
        mongodb.updateStatus(socket.userName,require('./src/define').userStatus.OFFLINE,(res)=>{
            sendOnlineUser();
        })
    });

    socket.on('signup', function (data) {
        mongodb.hadName(data.name, function (result) {
            if (result) {
                const errorMessage = "Tên người dùng đã tồn tại!";
                socket.emit('signupError', errorMessage);
            } else {
                mongodb.addUser(data,()=>{
                    socket.emit('signupSuccess', result);
                })
            }
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

var sendOnlineUser = () => {
    mongodb.getAllOnlineUser((listUserName)=>{
        io.sockets.emit('onlineUser', listUserName);
        console.log(listUserName);
    });
}
//mongodb.useTable("Conversation");
var conversation = new Conversation(["abc", "123"].sort());
// mongodb.findRoom(["abc", "123"], function (id) {
//     console.log(id);
// })
server.listen(process.env.PORT || 3000);