$(function() {
    var modal = $('#id01');

    modal.on('click', function() {
        modal.style.display = "none";
    });

    $('#btn-continute').on('click', function() {
        var name = $('#username').val();
        var pass = $('#password').val();
        if (mongodb.isValidateUser({ name: name, pass: pass })) {
            alert("true");
        } else {
            alert("false");
        };
    });
});