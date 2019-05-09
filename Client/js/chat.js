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
        const validImageTypes = ["image/gif", "image/jpeg", "image/png","image/ico"];
        if (data.type === "text"){
            $("#messages").append("<li  class=" + who + "> <p>" + data.object + " </p>" +
            "</li>");
        } else if ($.inArray(data.type, validImageTypes) >= 0){
            var result = "data:image/png;base64,"+convertB64(data.object)
            var li = $("<li  class=" + who + "> <img src="+result+" width='40%'/> </li>"); 
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
            socket.emit('send', { username: username,type:"text", sendTime: sendTime, object:message});
        }
    }

    var sendFile = (file) => {
        const username = $('#ip-user-name').val();
        const message = $('#message-input').val();
        const sendTime = new Date().getHours();
        // foreach(file.target.files,function(item){
            // const fileType = item.type;
            // socket.emit('send', {username: username,type:fileType ,
            //                      sendTime: sendTime,object: item});
        // });
        Array.from(file.target.files).forEach((item)=>{
            const fileType = item.type;
            socket.emit('send', {username: username,type:fileType ,
                                 sendTime: sendTime,object: item});
        })

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

    var joinRoom = (roomName)=>{
        socket.emit('joinRoom', roomName);
    }

});