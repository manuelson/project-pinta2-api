const { PORT, CORS_URL } = require('./utils/secrets');
const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const socketIO = require('socket.io')(http, {
    cors: {
        origin: CORS_URL
    }
});
app.use(cors())

let users = []
socketIO.use((socket, next) => {
    const token = socket.handshake.auth.token;

    // TODO: CHECK TOKEN FROM DB
    if (token === 'valid') {
        return next();
    }
    return next(new Error('authentication error'));
});

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)

    // get previous messages
    socket.on("newUser", data => {
        users.push({ ...data, socketID: socket.id })
        socketIO.emit("newUserResponse", users)
    })

    socket.on("chatMessage", data => {
        socketIO.emit("chatMessageResponse", data)
    })

    socket.on("canvas", data => {
        console.log(data)
        socketIO.emit("canvasResponse", data)
    })

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        users = users.filter(user => user.socketID !== socket.id)
        socketIO.emit("newUserResponse", users)
        socket.disconnect()
    });
});

app.get("/", (req, res) => {
    res.json({ message: "Pinta2 :)" })
});


http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
