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
        var result = "data:image/png;base64," + convertB64(data.message)
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
            convertImageMessage(owner, data.message);
        } else {
            $('#friend-name').text(data.username);
            convertImageMessage(friend, data.message);
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

    //hien lai form dang nhap neu bo qua
    $('#float-button').on('click', () => {
        $('#signin').show();
    });

    //mac dinh an menu va input doi biet hieu
    $('#setting-menu').hide();
    $("#ip-user-name").hide();

    $('#setting-icon').on('click', () => {
        $('#setting-menu').toggle(50, 'linear');
    });
    //chon menu item thay doi biet hieu
    $('#menu-change-name').on('click', () => {
        $('#ip-user-name').toggle(50);
    });
/*test join room
--------------------------------------------------*/
    $('#menu-join-room').on('click', () => {
        $('#input-join-room').toggle(50);
        $('#btn-join-room').toggle(50);
    });
    $('#btn-join-room').on('click', ()=>{
        joinRoom($('#ip-join-room').val());
        console.log("$('#ip-join-room').val() = " +$('#ip-join-room').val());
    })
/*--------------------------------------------------*/
    //nhan enter len input, doi biet hieu
    $("#ip-user-name").on('keypress', (e) => {
        //vì một số browser dùng keyCode, một số dùng keyWhich, nên lấy 1 trong 2
        var keyCode = (e.keyCode ? e.keyCode : e.keyWhich);
        if (keyCode == '13') {
            //doi biet hieu
        }
    });

    $('input[type="file"]').change(function(file) {
        sendFile(file);
    });

    //**************************************************************************
    //Hàm xử lý
    //**************************************************************************
    var convertMessage = (who, data) => {
        $("#messages").append("<li  class=" + who + "> <p>" + data.message + " </p>" +
            "</li>");
        console.log(who);
    }

    var convertImageMessage = (who, data) => {
        var img = $("<li  class=" + who + "> <img src=" + data + " width='40%'/> </li>");
        console.log(who);
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

    var sendFile = (file) => {
        const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
        const fileType = file.target.files[0].type;
        const username = $('#ip-user-name').val();
        const message = $('#message-input').val();
        const sendTime = new Date().getHours();
        if ($.inArray(fileType, validImageTypes) < 0) {
            socket.emit('sendFile', { username: username, message: file.target.files[0], sendTime: sendTime });
        } else {
            socket.emit('sendImage', { username: username, message: file.target.files[0], sendTime: sendTime });
        }
    }

    function convertB64(data) {
        var t = "";
        var n = new Uint8Array(data);
        var r = n.byteLength;
        for (var i = 0; i < r; i++) {
            t += String.fromCharCode(n[i])
        }
        return window.btoa(t)
    }

    var joinRoom = (roomName)=>{
        socket.emit('joinRoom', roomName);
    }

});