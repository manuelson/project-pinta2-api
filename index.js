const { PORT, CORS_URL } = require('./utils/secrets');
const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
console.log(CORS_URL)
const socketIO = require('socket.io')(http, {
    cors: {
        origin: CORS_URL
    }
});

app.use(cors())
let users = []
let messages = [];
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)

    // get previous messages
    socket.on("newUser", data => {
        users.push({ ...data, socketID: socket.id })
        socketIO.emit("newUserResponse", users)
    })

    socket.on("message", data => {
        socketIO.emit("messageResponse", data)
    })

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        users = users.filter(user => user.socketID !== socket.id)
        socketIO.emit("newUserResponse", users)
        socket.disconnect()
    });
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello" })
});


http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
