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
	console.log('Connected');
    socket.on('send', function (data) {
        io.sockets.emit('send', data);
    });

    socket.on('login',function (data){
    	mongodb.isValidateUser(data,function(result){
    		console.log(result);
    		io.sockets.emit('signin', result.name != "");
    		user = result;
    	});
    }); 
});
server.listen(3000);