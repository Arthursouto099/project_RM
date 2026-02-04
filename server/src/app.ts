import express, { urlencoded } from "express";
import dotenv from "dotenv";
import router from "./router/routes";
import cors from "cors";
import GlobalErrorHandler from "./Handlers/GlobalErrorHandler";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(urlencoded({ extended: true }));

app.use("/v1", router);
app.use(GlobalErrorHandler);

// Cria o servidor HTTP
const httpServer = createServer(app);

// Cria o Socket.IO e exporta
// Nesse socket eu defino o IO que recebe metodos como GET E Post e aceita apenas
// da url do meu front end
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

export { io, httpServer };

// io.on("connection", (socket) => {
//   socket.on("joinPosts", () => {socket.join("postsRoom")})

//   socket.on("joinChat", (chatId) => {socket.join(chatId)})

//   socket.on("disconnect", () => {})
// })
