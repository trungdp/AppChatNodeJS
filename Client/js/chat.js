$(function () {
    //Kết nối tới server socket đang lắng nghe
    var socket = io.connect('http://localhost:3000');
    var convertMessage = (who,data)=> $("#messages").append("<li  class="+who+"> <p>" 
                + data.username + ": " + data.message + " </p>"
                +"</li>");
    //Socket nhận data và append vào giao diện
    socket.on("send", function (data) {
        var username = $('#user-name').val();
        var owner = 'owner-message';
        var friend = 'friends-message';
        if (data.username === username){
            convertMessage(owner, data);
        } else {
            $('#friend-name').text(data.username);
            convertMessage(friend, data);
        }
    });

    //Bắt sự kiện click gửi message
    $("#send-button").on('click', function () {
        var username = $('#user-name').val();
        var message = $('#message').val();
        var sendTime = new Date().getHours();
        if ( message == '') {
            alert('Please enter name and message!!');
        } else {
            //Gửi dữ liệu cho socket
            socket.emit('send', {username: username, message: message, sendTime: sendTime});
            $('#message').val('');
        }
    });

    var mongodb = require('./Database/MongoDB');

    $('#btn-login').on('click', function () {
        var name = $('#username').val(); 
        var pass = $('#password').val();
        alert("login");
        if (mongodb.isValidateUser({name:name,pass:pass})) {
            alert("true");
        } else {
            alert("false");
        }
    });
})