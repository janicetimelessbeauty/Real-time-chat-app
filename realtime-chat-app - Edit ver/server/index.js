const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
const userRoutes = require("./routes/userRoute")
const messageRoutes =require ("./routes/messageRoute")
const socket = require ("socket.io")
require("dotenv").config()
app.use(cors())
app.use(express.json())
app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoutes)
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on Port ${process.env.PORT}`)
})
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB Success"))
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
})
global.onlineUsers = new Map()
io.on("connection", (socket) => {
    global.chatSocket = socket
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id)
    })
    socket.on("send-msg", (data) => {
        console.log("send-msg", {data})
        const sendUserSocket = onlineUsers.get(data.to)
        if(sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-received", data.message)
        }
    })
})