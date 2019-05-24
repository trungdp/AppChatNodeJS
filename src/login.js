const host = require('./define').host;
const $ = require('jquery');

$(function() {
    $('#signin').ready(() => {
        showSignin();
    });
    //Socket nhận data và append vào giao diện

    $('#btn-skip').on('click', () => {
        $('#signin').hide();
        $('#rooms-order').show();
    });

    var btnSwitch = $('#btn-switch-login');
    var note = $('#bottom-note');

    btnSwitch.on('click', () => {
        console.log('btn switch');
        if (btnSwitch.text() === 'Đăng nhập') {
            showSignin();
        } else {
            showSignUp();
        }
    });
    var title = $('#h1-title');
    $('#note-link').on('click', () => {
        if ($('#h1-title').text() === 'ĐĂNG NHẬP') {
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