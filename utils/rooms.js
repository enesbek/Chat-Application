const rooms = ['Chat Application', 'selam'];

function openRoom(room) {
    rooms.push(room);
    return room;
}

//Get current room
function getAllRooms(){
    return rooms;
}

module.exports = {
    rooms,
    openRoom,
    getAllRooms,
}
