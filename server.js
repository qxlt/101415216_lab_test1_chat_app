const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config(); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));


const userRoute = require("./routes/user");
const chatRoutes = require("./routes/chat");
app.use("/user", userRoute);
app.use("/chat", chatRoutes);


io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    socket.to(room).emit("message", { username, message: `${username} has joined the room.` });
  });

  socket.on("leaveRoom", ({ username, room }) => {
    socket.leave(room);
    socket.to(room).emit("message", { username, message: `${username} has left the room.` });
  });

  socket.on("chatMessage", async ({ username, room, message }) => {
    const Message = require("./models/Message");
    const newMessage = new Message({ sender: username, room, message, createAt: new Date() });
    await newMessage.save();
    io.to(room).emit("message", { username, message });
  });

  socket.on("typing", ({ username, room }) => {
    socket.to(room).emit("typing", { username });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => console.log("Server running on port 3000"));