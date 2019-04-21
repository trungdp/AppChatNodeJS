

$(function() {
    var socket = io.connect('http://localhost:3000');
    //Socket nhận data và append vào giao diện
    socket.on("signin", function (data) {
        if (data) {
            $('#signin').hide();
        } else {
            $('#signin').show();
        }
    });

    $('#btn-continue').on('click', function() {
        var name = $('#user-name').val();
        var pass = $('#password').val();
        $('#password').val("");
        $('#user-name').val("");
        socket.emit('signin', {name: name, pass:pass});
    });
});
