// const io = require('socket.io');
const $ = require('jquery');
const emoji = require('emojionearea');
const host = require('./define').host;
require('jquery-textcomplete');
var socket = io.connect(host);

$(function() {
    //**************************************************************************
    //Define
    //**************************************************************************
    let roomName;
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('name')) {
        $("#ip-user-name").val(searchParams.get('name'));
        $('#ip-user-name').toggle(50);
        $('#rooms-order').hide();
    }

    $("#message-input").emojioneArea({});
    const constraints = window.constraints = {
        audio: false,
        video: true
    };

    //**************************************************************************
    //Socket event
    //**************************************************************************
    //signin/signip event
    //**************************************************************************
    socket.on("signinError", function(errorMessage) {
        alert(errorMessage);
    });

    socket.on("signupError", function(errorMessage) {
        alert(errorMessage);
    });

    socket.on("signinSuccess", function(obj) {
        
    });

    socket.on("signupSuccess", function(obj) {
        alert('Đăng ký thành công!');
        $('#password').val("");
        $('#user-name').val("");
        showSignin();
    });

    socket.on('onlineUser', (listUserName => {
        console.log(listUserName);
        $('.list-friends').html("");
        listUserName.forEach((name) => {
            $('.list-friends').append('<div class="friendName">' + name + '</div>');
        });
    }));

    //chat event
    //***************************************************************************
    socket.on('roomOrder', (data) => {
        $('#rooms').empty();
        data.map((room) => {
            var newRoom = document.createElement("P");
            newRoom.className = 'button green-button room inset-shadow';
            newRoom.innerHTML = room.name;
            newRoom.addEventListener("click", () => {
                //neu da co phong thi roi khoi phong truoc khi tham gia phong moi
                if (roomName) { socket.emit('leaveRoom', roomName) };
                roomName = room.name;
                socket.emit('joinRoom', roomName);
                $('#rooms-order').hide();
                $('#content').show();
                $('#friend-name').text(roomName);
            });
            $('#rooms').append(newRoom);
        })
    });
    socket.on("send", function(data) {
        var username = $('#ip-user-name').val();
        var owner = 'owner-message';
        var friend = 'friends-message';
        if (data.username === username) {
            convertMessage(owner, data);
        } else {
            //$('#friend-name').text(data.username);
            convertMessage(friend, data);
        }
    });

    //**************************************************************************
    //UI Event
    //**************************************************************************

    //signin/signup
    //**************************************************************************
    var title = $('#h1-title');
    $('#btn-continue').on('click', () => {
        if (title.text() === 'ĐĂNG NHẬP') {
            console.log('signin buttton clicked');
            if (checkEmptySignin() == null) {
                action('signin');
                $('#signin').hide();
                $('#content').show();
            } else {
                alert(checkEmptySignin());
            }
        } else {
            console.log('signup buttton clicked');
            if (checkEmptySignup() == null) {
                action('signup');
                $('#signin').hide();
                $('#content').show();
            } else {
                alert(checkEmptySignup());
            }
        }
    });

    //chat
    //*************************************************************************
    $("#btn-send").on('click', function() {
        sendMessage();
        $('.emojionearea-editor').empty();
    });

    $('input[type="file"]').change(function(file) {
        sendFile(file);
    });

    $("#message-input").on('keypress', (e) => {
        //vì một số browser dùng keyCode, một số dùng keyWhich, nên lấy 1 trong 2
        var keyCode = (e.keyCode ? e.keyCode : e.keyWhich);
        if (keyCode == '13') {
            sendMessage();
            $('.emojionearea-editor').empty();
        }
    });

    $(".emojionearea-editor").change(function() {
        var text = $(".emojionearea-editor").text();
        alert(text);
        if (keyCode == '13') {
            sendMessage();
            $('.emojionearea-editor').empty();
        }
    });

    //hien lai form dang nhap neu bo qua
    $('#menu-signin').on('click', () => {
        location.assign(host + 'index');
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
        $('#setting-menu').hide();
    });
    $('#menu-change-background').on('click', () => {
        console.log('change-background');
        initChangeBackgound();
        $('#change-background').show();
        $('#setting-menu').hide();
    });
    
    //join room
    /*--------------------------------------------------*/
    $('#menu-join-room').on('click', () => {
        $('#rooms-order').show();
        $('#setting-menu').hide();
    });
    /*--------------------------------------------------*/
    //nhan enter len input, doi biet hieu
    $("#ip-user-name").on('keypress', (e) => {
        //vì một số browser dùng keyCode, một số dùng keyWhich, nên lấy 1 trong 2
        var keyCode = (e.keyCode ? e.keyCode : e.keyWhich);
        if (keyCode == '13') {
            //doi biet hieu
        }
    });

    $('#btn-add-room').on('click', () => {
        $('#create-room').toggle(30);
    });
    $('#btn-confirm-create').on('click', () => {
        if ($('#ip-new-room').val() === "") {
            alert("Bạn phải nhập tên phòng!")
        } else {
            var newName = $('#ip-new-room').val();
            $('#ip-new-room').val("");
            $('#create-room').hide();
            socket.emit('createRoom', newName);
            console.log(newName);
        }
    });

    //**************************************************************************
    //Hàm xử lý
    //**************************************************************************
    var checkEmptySignin = () => {
        var name = $('#user-name').val();
        var pass = $('#password').val();
        if (name.trim() === "" || name == null) {
            return "Tên không được để trống";
        } else if (pass.trim() === "" || pass == null) {
            return "Mật khẩu không được để trống";
        } else {
            return null;
        }
    }

    var checkEmptySignup = () => {
        var name = $('#user-name').val();
        var pass = $('#password').val();
        var confirm = $('#password-confirm').val();
        if (name.trim() === "" || name == null) {
            return "Tên không được để trống";
        } else if (pass.trim() === "" || pass == null) {
            return "Mật khẩu không được để trống";
        } else if (confirm.trim() === "" || confirm == null) {
            return "Xác nhận mật khẩu không được để trống";
        } else if (pass != confirm) {
            return "Xác nhận mật khẩu không trùng khớp";
        } else {
            return null;
        }
    }

    var action = (action) => {
        var name = $('#user-name').val();
        var pass = $('#password').val();
        socket.emit(action, { name: name, pass: pass });
    }

    var convertMessage = (who, data) => {
        const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/ico"];
        if (data.type === "text") {
            $("#messages").append("<li  class=" + who + "> <p>" + data.object + " </p>" +
                "</li>");
        } else if ($.inArray(data.type, validImageTypes) >= 0) {
            var result = "data:image/png;base64," + convertB64(data.object)
            var li = $("<li  class=" + who + "> <img src=" + result + " width='40%'/> </li>");
            li.appendTo('#messages');
        } else {
            var li = $("<li class=" + who + ">  </li>");
            var a = $("<a download='file.txt' href='data:application/octet-stream,'> downfile </a>");
            a.appendTo(li);
            li.appendTo('#messages');
        }
        console.log(data.type);
        console.log(who);
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
            console.log(message);
            socket.emit('send', { username: username, type: "text", sendTime: sendTime, object: message });
        }
    }

    var sendFile = (file) => {
        const username = $('#ip-user-name').val();
        const message = $('#message-input').val();
        const sendTime = new Date().getHours();
        Array.from(file.target.files).forEach((item) => {
            const fileType = item.type;
            socket.emit('send', {
                username: username,
                type: fileType,
                sendTime: sendTime,
                object: item
            });
        })
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
    var joinRoom = (roomName) => {
        socket.emit('joinRoom', roomName);
    }
    var initChangeBackgound = () => {
        var listBackgrounds = ["../images/backgrounds/1.png", "../images/backgrounds/2.png", "../images/backgrounds/3.png", "../images/backgrounds/4.png", "../images/backgrounds/5.png"];
        $('#change-background').empty();
        listBackgrounds.map((bgSource) => {
            var bg = document.createElement("IMG");
            bg.className = 'inset-shadow';
            bg.src = bgSource;
            bg.addEventListener("click", () => {
                setBackground(bgSource);
                $('#change-background').hide();
            });
            $('#change-background').append(bg);
        })

    }
    var setBackground = (source) => {
        $(".background").css("background-image", "url(" + source + ")");
    }
});

function openStream() {
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

socket.on('callVideo',()=>{
    socket.emit('answerID',socket.peerID);
});
socket.on('answerID',(id)=>{
    openStream()
    .then( stream=>{
        $('#callvideo').show();
        $('#content').hide();
        playStream('my-video',stream);
        const call = peer.call(id,stream);
        call.on('stream',remoteStream => playStream('friend-video',remoteStream));
    });
});

var peer = new Peer({key:'lwjd5qra8257b9'});

peer.on('open',(id)=>{
    socket.peerID = id;
    socket.emit("sendPeerID",id);
});

$('#call').on('click', () => {
    socket.emit('callVideo');
});

peer.on('call',call=>{
    openStream()
    .then(stream=>{
        call.answer(stream);
        $('#callvideo').show();
        $('#content').hide();
        playStream('my-video',stream);
        call.on('stream',remoteStream=>playStream('friend-video',remoteStream));
    });
});