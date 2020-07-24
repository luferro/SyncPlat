const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const users = {}, all_users_room = [];

io.on('connection', socket => {
  socket.on('new-user', (name, room) => {
    let existe = false;

    users[socket.id] = {"name": name, "room": room};
    socket.join(users[socket.id].room);
    socket.to(users[socket.id].room).broadcast.emit('user-connected', name);

    for(var i = 0; i < all_users_room.length; i++) {
      if(all_users_room[i].name !== name)
        existe = false;
      else existe = true;
    }    

    if(!existe) all_users_room.push({room: room, name: name}); 
  })
  socket.on('send-chat-message', message => {
    socket.to(users[socket.id].room).broadcast.emit('chat-message', { message: message, name: users[socket.id].name })
  })
  socket.on('mouse', data => {
    socket.to(users[socket.id].room).broadcast.emit('mouse', data);
  })
  socket.on('play', () => {
    socket.to(users[socket.id].room).broadcast.emit('play');
  }) 
  socket.on('pause', () => {
    socket.to(users[socket.id].room).broadcast.emit('pause');
  }) 
  socket.on('video-time', time => {
    socket.to(users[socket.id].room).broadcast.emit('video-time', time);
  }) 
  socket.on('chosen-video', videoURL => {
    socket.to(users[socket.id].room).broadcast.emit('chosen-video', videoURL);
  })
  socket.on('list-users', room => {
    const online_users = [];

    for(var i = 0; i < all_users_room.length; i++) {
      if(all_users_room[i].room === room && !online_users.includes(all_users_room[i].name))
        online_users.push(all_users_room[i].name)
    }

    socket.to(users[socket.id].room).broadcast.emit('list-users', online_users);
  })
  socket.on('user-disconnected', name => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    for(var i = 0; i < all_users_room.length; i++) {
      if(all_users_room[i].name === name)
        all_users_room.splice(i, 1);
    }
    delete users[socket.id]
  })
})

server.listen(PORT, () => {
	console.log(`Servidor iniciado na porta ${PORT}`);
});