$(function() {
    var mongodb = require('./Database/MongoDB');
    var modal = $('#id01');

    modal.on('click', function() {
        modal.style.display = "none";
    });

    $('#btn-test').on('click', function() {
        alert("login");
        var name = $('#username').val();
        var pass = $('#password').val();
        alert("login");
        if (mongodb.isValidateUser({ name: name, pass: pass })) {
            alert("true");
        } else {
            alert("false");
        };
    });
});