var express = require('express');
var app = express();
app.use(express.static('./public')); //http:localhos
app.set("view engine", "ejs");
app.set('views', './views');

var server = require("http").Server(app);
var io = require('socket.io')(server);
server.listen(3000);

var userList = [];

io.on('connection', function (socket) {
    console.log(socket.id + " đã đăng nhập!");

    socket.on('client-send-Username', function (data) {
        console.log(data);
        if (userList.indexOf(data) >= 0) {
            //fail
            socket.emit('server-send-fail-register');
        } else {
            //successfully
            userList.push(data);
            socket.Username = data;
            socket.emit('server-send-successfull-register', data);
            io.sockets.emit("server-send-user-list", userList);

        }
        socket.on('logout', function () {
            userList.splice(
                userList.indexOf(socket.Username), 1
            );
            socket.broadcast.emit('server-send-user-list', userList);

        });

        socket.on('user-send-message', function (data) {
            io.sockets.emit('server-send-message', {username: socket.Username, message: data});
        });

        socket.on('user-typing', function () {
            var s = socket.Username + " is typing";
            socket.broadcast.emit('server-send-user-typing', s);
        });

        socket.on('user-stop-typing', function () {
            socket.broadcast.emit('server-send-user-stop-typing');
        });

    });
});

app.get('/', function (req, res) {
    res.render('trangchu');
})