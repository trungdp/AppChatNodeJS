var path = require("path");
var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongodb = require('./Database/MongoDB');
var user = require('./Model/User');
var message = require('./Model/Message');
var myInfo = new user();

//Chỉ ra đường dẫn chứa css, js, images...
app.use(express.static(path.join(__dirname, 'Client')));

//Tạo router
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + '/Client/login.html'));
});

//Tạo socket 
io.on('connection', function (socket) {
    io.sockets.emit('login', Boolean(user.name != ""));

    socket.on('send', function (data) {
        io.sockets.emit('send', data);
    });

    socket.on('login',function (data){
    	mongodb.isValidateUser(data,function(result){
    		io.sockets.emit('login', result.name != "");
    		user = result;
    	});
    });
});

// mongodb.connect();
// mongodb.createTable("User");
// var obj1 = {name: "trung",pass: "1"};
// var obj2 = {name: "vu",pass: "2"};
// var obj3 = {name: "quan",pass: "3"};
// mongodb.insert([obj1,obj2,obj3],"User");

// mongodb.insert([new user("onl")],"User");
// mongodb.query({name: "nhac",pass:"4"},"User",function(result){
// 	console.log(result.map(function(item){return item._id}));
// });

// console.log((new message("aius","jsakf",'1554920901547',"12312")).getDate());
//Khởi tạo 1 server listen tại 1 port
server.listen(3000);