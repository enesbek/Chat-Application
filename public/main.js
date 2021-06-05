const socket  = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');
const addRoomBtn = document.getElementById('add-room');
const roomList = document.getElementById('rooms');

//Gets message from server
socket.on('message', message => {
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//When submit message
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  //Get message text 
  const msg = e.target.elements.msg.value;

  //Emitting the message to server
  socket.emit('chatMessage', msg);

  //Clear input after send
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

//Get username from URL
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

//Get room and user
socket.on('roomUsers', ({rooms, users}) => {
  outputRoomName(rooms);
  outputUsers(users);
});

//Add room name to DOM

function outputRoomName(rooms){
  roomList.innerHTML = `${rooms.map(room => 
      `<li><button class="btn" id="room-btn" onclick="openRoom(this)">
        ${room}</button></li>`).join('')}`;
}

//Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}

//Add new Room text
addRoomBtn.addEventListener('click', addRoomText);
function addRoomText(){
  var newRoomName = prompt("Please Enter Room Name");
  socket.emit('create', newRoomName);
  window.location.reload();
}

//Open Room
function openRoom(thisRoom) {
  var currentURL = window.location.href;
  var changeURL = currentURL.split("room=")[0];
  changeURL += "room=" + thisRoom.innerHTML;
  window.open(changeURL, "_self");
}

//Join Chat Application
socket.emit('joinChat', {username, room});