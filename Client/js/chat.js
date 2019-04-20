$(function() {
    //Kết nối tới server socket đang lắng nghe
    var socket = io.connect('http://localhost:3000');

    //Socket nhận data và append vào giao diện
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
    $('#btn-skip').on('click', ()=>{
        $('#signin').hide();
        $('#float-button').show();
    });

    var btnSwitch = $('#btn-switch-login');
    var title = $('#h1-title');
    var note = $('#bottom-note');

    btnSwitch.on('click', () => {
        console.log('btn switch');
        if (btnSwitch.text() === 'Đăng nhập') {
            showLogin();
            btnSwitch.text('Đăng ký');
        } else { 
            showSignin();
            btnSwitch.text('Đăng nhập');
        }
    });

    $('#btn-continue').on('click', ()=>{
        if(title.text() === 'ĐĂNG NHẬP'){
            console.log('login buttton clicked');
            //logInfunction();
        }else{
            console.log('signin buttton clicked');
            //signInFunction();
        }
    })


    //**************************************************************************
    //Hàm xử lý
    //**************************************************************************
    var convertMessage = (who, data) => {
        $("#messages").append("<li  class=" + who + "> <p>" +
            data.username + ": " + data.message + " </p>" +
            "</li>");
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

    var showLogin = () => {
        var signinNote = "<p id='bottom-note'><a id='note-link' href='#''>Quên mật khẩu?</a></p>"
        title.text('ĐĂNG NHẬP');
        note.empty();
        note.append(signinNote);
    }
    var showSignin = () => {
        var signinNote = "<p id='bottom-note'><a id='note-link' href='#''>Đăng nhập</a> nếu bạn đã là thành viên của DLChat</p>"
        title.text('ĐĂNG KÝ');
        note.empty();
        note.append(signinNote);
    }
});