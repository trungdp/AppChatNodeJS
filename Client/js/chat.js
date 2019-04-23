$(function() {
    //**************************************************************************
    //Define
    //**************************************************************************
    var socket = io.connect('http://localhost:3000');

    //**************************************************************************
    //Socket event
    //**************************************************************************
    socket.on("send", function(data) {
        var username = $('#ip-user-name').val();
        var owner = 'owner-message';
        var friend = 'friends-message';
        if (data.username === username) {
            convertMessage(owner, data);
        } else {
            $('#friend-name').text(data.username);
            convertMessage(friend, data);
        }
    });

    socket.on('imageConversionByClient', function(data) {
        var result = "data:image/png;base64,"+convertB64(data.buffer)
        var username = $('#ip-user-name').val();
        var owner = 'owner-message';
        var friend = 'friends-message';
        if (data.username === username) {
            convertImageMessage(owner, result);
        } else {
            $('#friend-name').text(data.username);
            convertImageMessage(friend, result);
        }
    });

    socket.on('imageConversionByServer', function(data) {
        var username = $('#ip-user-name').val();
        var owner = 'owner-message';
        var friend = 'friends-message';
        if (data.username === username) {
            convertImageMessage(owner, data);
        } else {
            $('#friend-name').text(data.username);
            convertImageMessage(friend, data);
        }
    });

    //**************************************************************************
    //UI Event
    //**************************************************************************

    $("#btn-send").on('click', function() {
        sendMessage();
    });

    $("#message-input").on('keypress', (e) => {
        //vì một số browser dùng keyCode, một số dùng keyWhich, nên lấy 1 trong 2
        var keyCode = (e.keyCode ? e.keyCode : e.keyWhich);
        if (keyCode == '13') {
            sendMessage();
        }
    });

    $('#float-button').on('click', ()=>{
        $('#signin').show();
    })

    //**************************************************************************
    //Hàm xử lý
    //**************************************************************************
    var convertMessage = (who, data) => {
        $("#messages").append("<li  class=" + who + "> <p>" +
            data.username + ": " + data.message + " </p>" +
            "</li>");
    }

    var convertImageMessage = (who, data) => {
        var img = $('<img id="dynamic"  width="40%">'); 
        img.attr('src', data);
        img.appendTo('#messages');
    }

    var sendMessage = () => {
        var username = $('#ip-user-name').val();
        var message = $('#message-input').val();
        var sendTime = new Date().getHours();
        if (message === '') {
            alert('Please enter name and message!!');
        } else {
            $('#message-input').val('');
            //Gửi dữ liệu cho socket
            socket.emit('send', { username: username, message: message, sendTime: sendTime });
        }
    }

    function convertB64(data){
        var t="";
        var n=new Uint8Array(data);
        var r=n.byteLength;
        for(var i=0;i<r;i++) {
            t+=String.fromCharCode(n[i])
        }
        return window.btoa(t)
    }
    
});