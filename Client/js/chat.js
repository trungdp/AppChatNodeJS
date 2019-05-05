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

    //hien lai form dang nhap neu bo qua
    $('#float-button').on('click', () => {
        $('#signin').show();
    });

    //mac dinh an menu va input doi biet hieu
    $('#setting-menu').hide();
    $("#ip-user-name").hide();

    $('#setting-icon').on('click',()=> {
        $('#setting-menu').toggle(50, 'linear');
    });
    //chon menu item thay doi biet hieu
    $('#menu-change-name').on('click', ()=>{
        $('#ip-user-name').toggle(50);
    });
    //nhan enter len input, doi biet hieu
    $("#ip-user-name").on('keypress', (e) => {
        //vì một số browser dùng keyCode, một số dùng keyWhich, nên lấy 1 trong 2
        var keyCode = (e.keyCode ? e.keyCode : e.keyWhich);
        if (keyCode == '13') {
            //doi biet hieu
        }
    });

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


});