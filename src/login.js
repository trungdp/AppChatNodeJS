const host = require('./define').host;
const $ = require('jquery');

$(function() {
    var socket = io.connect(host);
    let user;
    $('#signin').ready( () => {
        showSignin();
    });
    //Socket nhận data và append vào giao diện
    socket.on("signin", function(data) {
        if (data) {
            $('#signin').hide();
        } else {
            $('#signin').show();
        }
        user = data;
        console.log(user);
    });

    var action = (action) => {
        var name = $('#user-name').val();
        var pass = $('#password').val();
        $('#password').val("");
        $('#user-name').val("");
        socket.emit(action, { name: name, pass: pass });
    }

    $('#btn-skip').on('click', () => {
        $('#signin').hide();
        $('#float-button').show();
        location.assign(host + 'index');
        console.log("http://localhost:3000/index");
    });

    var btnSwitch = $('#btn-switch-login');
    var title = $('#h1-title');
    var note = $('#bottom-note');

    btnSwitch.on('click', () => {
        console.log('btn switch');
        if (btnSwitch.text() === 'Đăng nhập') {
            showSignin();
        } else {
            showSignUp();
        }
    });

    $('#btn-continue').on('click', () => {
        if (title.text() === 'ĐĂNG NHẬP') {
            console.log('signin buttton clicked');
            action('signin');
        } else {
            console.log('signup buttton clicked');
            action('signup');
        }
    });

    $('#note-link').on('click', ()=>{
        if (title.text() === 'ĐĂNG NHẬP') {
            console.log('forget password');
        } else {
            showSignin();
        }
    });


    var showSignin = () => {
        $('#password-confirm').hide();
        var signinNote = "<p id='bottom-note'><a id='note-link' href='#''>Quên mật khẩu?</a></p>"
        title.text('ĐĂNG NHẬP');
        note.empty();
        note.append(signinNote);
        btnSwitch.text('Đăng ký');
    }
    var showSignUp = () => {
        $('#password-confirm').show();
        var signinNote = "<p id='bottom-note'><a id='note-link' href='#''>Đăng nhập</a> nếu bạn đã là thành viên của DLChat</p>"
        title.text('ĐĂNG KÝ');
        note.empty();
        note.append(signinNote);
        btnSwitch.text('Đăng nhập');
    }
});