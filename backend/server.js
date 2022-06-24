
const connectDB = require("./config/db");
const {errorHandler, notFound} = require('./middleware/errorMiddleware');
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

//libraries
const path = require("path");
const dotenv = require("dotenv");
const colors = require("colors");

const express = require('express');
const app = express();

app.use(express.json());
dotenv.config();
connectDB();
//const PORT = process.env.PORT || 5000

const morgan = require('morgan');
app.use(morgan('dev'));
//-----------------DEPLOYMENT-------------------
/*

const _dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production'){
    console.log("prod")
    app.use(express.static(path.join(_dirname1, "/frontend/build")));
    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(_dirname1, "frontend", "build", "index.html"));
    });
} else {
    console.log("dev")
    app.get('/', (req,res) => {
        res.send('api running')
    })
}
*/


//-----------------DEPLOYMENT-------------------




app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);



if(process.env.NODE_ENV === 'production'){
    console.log('prod')
    app.use(express.static('frontend/build'));

    app.get('*', (request, response) => {

        response.sendFile(path.join(__dirname, '..', 'frontend/build', 'index.html'));

    });

}

app.use(notFound);
app.use(errorHandler);

// ------LAUNCH SERVER-------

/*
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



})*/

module.exports = app;