const app = require('./server')
const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`.yellow.bold))



const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    console.log("connected to socket.io".cyan.bold);

    //new socket for each user
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    //new socket for each room
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("user joined room: "+room);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));


    //new socket for each new message
    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if(!chat.users) console.log("chat.users not defined");
        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        })
    })

    socket.off("setup", (userData)=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })



})