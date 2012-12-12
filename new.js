var app = require('express').createServer()
  , io = require('socket.io').listen(app);

var users = [];//notre tableau qui contiendra nos nicks

app.listen(8080);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});


io.sockets.on('connection', function (socket) {



    //on detecte l envoie de pseudo et on les ajoutes dans notre variable user si ils sont pas deja pris
    socket.on('login/connect', function (data,done) {
        
        if (users.indexOf(data) != -1) {
            return done(false);
        }
        socket.nickname = data;
        users.push(data);
        done(true);

        socket.emit('new-user', {
            text: data
        });
        socket.broadcast.emit('new-user', {
            text: data
        });
    });
    //on detecte les nouveau message et les broadcast a tout le monde avec le nick de l user
    socket.on('message', function (data) {
        console.log(socket.nickname);
        socket.broadcast.emit('new-message', {
            text: data,
            nickname: socket.nickname
        });
        socket.emit('new-message', {
            text: data,
            nickname: socket.nickname
        });


    });

    socket.on('disconnect', function () {
        var nickname = socket.nickname;

        if (nickname) {
            socket.broadcast.emit('user-leave', socket.nickname);
            users.splice(users.indexOf(nickname), 1);
        }

    });

		socket.emit('socketOk', {
			hello: 'world'
		});

	

});
