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

//Tạo router
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + '/Client/login.html'));
});

//let roomno = 1;
//Tạo socket 
io.on('connection', function (socket) {
	console.log('Connected');

    /*if((io.nsps['/'].adapter.rooms["room-"+roomno]) && (io.nsps['/'].adapter.rooms["room-"+roomno].length > 1)) roomno++;
    socket.join("room-"+roomno);*/


    socket.on('send', function (data) {
        io.sockets.emit('send', data);
    });
    socket.on('signin',function (data){
    	mongodb.isValidateUser(data,function(result){
    		console.log(result);
    		io.sockets.emit('signin', result.name != "");
    		user = result;
    	});
    }); 

    socket.on('sendImage',function (data){
        socket.emit('imageConversionByClient', data);
        console.log(data);
    })

    socket.on('sendFile',function (data){
        socket.emit('imageConversionByClient', data);
    })
});

mongodb.connect();
mongodb.createTable("User");
var obj1 = {name: "trung",pass: "1"};
var obj2 = {name: "vu",pass: "2"};
var obj3 = {name: "quan",pass: "3"};
mongodb.insert([obj1,obj2,obj3],"User");
server.listen(3000);