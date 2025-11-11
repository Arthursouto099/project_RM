import {io} from "../app"


io.on("connection", (socket) => {
  socket.on("joinPosts", () => {socket.join("postsRoom")})

  socket.on("joinChat", (chatId) => {socket.join(chatId)})

  socket.on("joinComments", () => {socket.join("commentRoom")})

  socket.on("disconnect", () => {})
})