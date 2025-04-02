import express from "express";
import { Server } from "socket.io";
import path from 'path';

//For modules required
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;
const ADMIN = "Admin";

const app = express();
app.use(express.static(path.join(__dirname, "public")));

//Routing
app.get('/solo', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "solo.html"))
});
app.get('/versus', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "versus.html"))
});

// Catch-all for undefined routes (404 handling)
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

const expressServer = app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`);
});

// A sudo makeshift DB that stores all active games on the site
// the users is an arr with the values of name,id,diceNum,sum,roomID
const UsersState = {
    users: [],
    setUsers: function (newUsersArray) {
        this.users = newUsersArray
    }
}

const io = new Server(expressServer, {
    //hosting the front-end on the different server we would need to put the address in cors
    //with express we host the server on the backend (we don't have it separate)
    //cross origins resource sharing
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

io.on('connection', socket => {

    console.log(`User: ${socket.id} connected`);

    //Upon connection - only to user
    socket.emit('message', BuildMsg(ADMIN, "Welcome to Dice-Roll Versus mode !"));

    socket.on('enterRoom', ({ name, room }) => {
        // leave previous room
        const prevRoom = GetUser(socket.id)?.room;

        if (prevRoom) {
            socket.leave(prevRoom);
            io.to(prevRoom).emit('message', BuildMsg(ADMIN, `${name} has left the room`));
        }

        const user = activeUser(socket.id, name, room)

        //Cannot update previous room users list until after the state update in activate user 
        if (prevRoom) {
            io.to(prevRoom).emit('userList', {
                users: GetUsersInRoom(prevRoom)
            })
        }

        //join room
        if (room) {
            socket.join(user.room);

            //To everyone else in the room
            socket.broadcast.to(user.room).emit('message', BuildMsg(ADMIN, `${user.name} has joined the room.`));

            // Update user list for room
            io.to(user.room).emit('userList', {
                users: GetUsersInRoom(user.room)
            });

            io.emit('roomList', {
                room: GetAllActiveRooms()
            })
        }
    });

    socket.on('disconnect', () => {
        const user = GetUser(socket.id);
        userLeavesApp(socket.id);
        if (user) {
            io.to(user.room).emit('message', BuildMsg(ADMIN, `${user.name} has left the room.`));
            io.to(user.room).emit('userList', {users: getUsersInRoom(user.room)});
            io.to(user.room).emit('roomList',{rooms: GetAllActiveRooms()});

        }
        console.log(`User: ${socket.id} disconnected`);
    });

    //The 'message' that is being sent
    //What im going to send is the name of the 
    socket.on('message',({name,sum})=>{
        const room = GetUser(socket.id)?.room;
        if(room){
            io.to(room).emit('message',BuildMsg(name,text));
        }
    });

});

function BuildMsg(name, sum) {
    return {
        name, sum
    };
}

//User functions
function activeUser(id, name, room, numDice, sum) {
    const user = { id, name, room, numDice, sum };
    UsersState.setUsers(
        ...UsersState.users.filter(user => user.id !== id),
        user
    );
    return user;
};

function userLeavesApp(id) {
    UsersState.setUsers(
        UsersState.users.filter(user => user.id !== id)
    );
};

function GetUser(id) {
    return UsersState.users.find(user => user.id === id);
};

function GetUsersInRoom(room) {
    return UsersState.users.filter(user => user.room === room);
};
function GetAllActiveRooms() {
    return Array.from(new Set(UsersState.users.map(user => user.room)));
}