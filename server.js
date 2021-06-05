const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getUsers} = require('./utils/users');
const {openRoom, getAllRooms} = require('./utils/rooms');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'Chat Application';

//Setting static folder
app.use(express.static(path.join(__dirname, 'public')));

//Client when connect this will be run
io.on('connection', socket => {
    
    socket.on('joinChat', ({username, room}) => {
       // document.getElementById('roomTitle').innerHTML = 

        const user = userJoin(socket.id, username, room);
        //const romms;

        socket.join(user.room);

        //When user connect 
        socket.emit('message', formatMessage(botName, 'Welcome to Chat Application'))
        
        //Message when user connect
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} joined the chat!`));

        //Send users and room
        io.to(user.room).emit('roomUsers', {
            rooms: getAllRooms(),
            users: getUsers()
        });
        
    });

    //Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //When create new Room
    socket.on('create', function (room) {
        openRoom(room);
        socket.join(room);
    });

    //When clients disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} left the chat!`));

            //Send users and room
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getUsers()

            });
        }      
    });

})


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

