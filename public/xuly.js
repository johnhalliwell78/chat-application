var socket = io("http://localhost:3000");

socket.on('server-send-fail-register', function () {
    alert("Sai đăng kí");
});
socket.on('server-send-user-list', function (data) {
    $('#boxContent').html('');
    data.forEach(function (i) {
        $('#boxContent').append("<div class='user'>" + i + "</div>");

    });
});
socket.on('server-send-successfull-register', function (data) {
    $('#currentUser').html(data);
    $('#loginForm').hide(2000);
    $('#chatForm').show(1000);

});
socket.on('server-send-message', function (data) {
    $('#listMessages').append("<div class='ms'>" + data.username + ": " + data.message + "</div>");
});

socket.on('server-send-user-typing', function (data) {
    $('#txtNotification').html("<img width='20px' src='typing-dot.gif'/>"+data);
});
socket.on('server-send-user-stop-typing', function () {
    $('#txtNotification').html('');
});
$(document).ready(function () {
    $('#loginForm').show();
    $('#chatForm').hide();

    $('#btnRegister').click(function () {
        socket.emit('client-send-Username', $('#txtUsername').val());
    });

    $('#btnLogout').click(function () {
        socket.emit('logout');
        $('#chatForm').hide(2000);
        $('#loginForm').show(1000);
        $('#txtUsername').html('');

    });

    $('#btnSendMessage').click(function () {
        socket.emit('user-send-message', $('#txtMessage').val());
        $('#txtMessage').html('');
    });


    $('#txtMessage').focusin(function () {
        socket.emit('user-typing');
    });
    $('#txtMessage').focusout(function () {
        socket.emit('user-stop-typing');
    });
});