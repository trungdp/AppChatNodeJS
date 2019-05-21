const host = require('./define').host;
const $ = require('jquery');

$(function () {
    var socket = io.connect(host);
    let user;
    $('#signin').ready( () => {
        showSignin();
    });
    //Socket nhận data và append vào giao diện
    socket.on("signinError", function(errorMessage) {
        alert(errorMessage);
    });

    socket.on("signupError", function (errorMessage) {
        alert(errorMessage);
    });

    socket.on("signinSuccess", function (obj) {
        location.assign(host + 'index?name=' + obj.name);
    });

    socket.on("signupSuccess", function (obj) {
        alert('Đăng ký thành công!');
        $('#password').val("");
        $('#user-name').val("");
        showSignin();
    });
    
    var action = (action) => {
        var name = $('#user-name').val();
        var pass = $('#password').val();
        socket.emit(action, { name: name, pass: pass });
    }

    $('#btn-skip').on('click', () => {
        $('#signin').hide();
        $('#float-button').show();
        location.assign(host + 'index');
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
            if (checkEmptySignin() == null){
                action('signin');
            } else {
                alert(checkEmptySignin());
            }
        } else {
            console.log('signup buttton clicked');
            if (checkEmptySignup() == null){
                action('signup');
            } else {
                alert(checkEmptySignup());
            }
        }
    });

    $('#note-link').on('click', () => {
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

    var checkEmptySignin = () => {
        var name = $('#user-name').val();
        var pass = $('#password').val();
        if (name.trim() === "" || name == null){
            return "Tên không được để trống";
        } else if(pass.trim() === "" || pass == null){
            return "Mật khẩu không được để trống";
        } else {
            return null;
        }
    }

    var checkEmptySignup = () => {
        var name = $('#user-name').val();
        var pass = $('#password').val();
        var confirm = $('#password-confirm').val();
        if (name.trim() === "" || name == null){
            return "Tên không được để trống";
        } else if(pass.trim() === "" || pass == null){
            return "Mật khẩu không được để trống";
        } else if (confirm.trim() === "" || confirm == null){
            return "Xác nhận mật khẩu không được để trống";
        } else if (pass != confirm){
            return "Xác nhận mật khẩu không trùng khớp";
        } else {
            return null;
        }
    }
});