var express = require('express');
var app = express();
var socket = require('socket.io');
var server = app.listen(4000, function(){
    console.log("Listning to port 4000");
})
var userNames = {};

app.use(express.static('public'));
var io = socket(server);

io.on('connection', function(socket){
    // console.log('made a connection',socket.id);
    

    // joining
    socket.on('join', function (data) {
        socket.join(data.email); // We are using room of socket io
      });
    
    // Handle chat event
    socket.on('chat', function(data){
        // console.log(data);
        // io.emit('chat', data);

        // custom code 
        console.log(data.handle);
        var uname = data.handle;
        console.log(userNames[uname])
        io.to(`${userNames[uname]}`).emit('chat',data);


    });
     // Handle typing event
     socket.on('typing', function(data){
        var uname = data.handle;
        // console.log(userNames[uname])
        socket.broadcast.to(`${userNames[uname]}`).emit('typing', data);
    });

    
    socket.on('setSocketId', function(data) {
    var userName = data.name;
    var userId = socket.id;
    userNames[userName] = userId;
    console.log(userNames);
    socket.nickname = data.name;
    });

    socket.on('disconnect', function(data) {
        // console.log(socket.nickname);
        let id =  socket.nickname;
        delete userNames[id];
        console.log(userNames)
        // console.log(userNames.findIndex(id))

      
    });


})