/* import express, { urlencoded } from "express"
import dotenv from "dotenv"
import router from "./router/routes"
import cors from "cors"
import GlobalErrorHandler from "./Handlers/GlobalErrorHandler"
import { createServer } from "http"
import {Server} from "socket.io"


dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())



app.use("/v1", router)



app.use(urlencoded({extended: true}))

app.use(GlobalErrorHandler)



const httpServer = createServer(app)


 export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});



io.on("connection", (socket) => {
    console.log("Novo cliente conectado", socket.id)

})


app.listen(process.env.PORT ?? 3000, (e) =>  {
    if(e) console.log(e)
    console.log(`Running in port http://localhost:${process.env.PORT}`)
}) */


import express, { urlencoded } from "express";
import dotenv from "dotenv";
import router from "./router/routes";
import cors from "cors";
import GlobalErrorHandler from "./Handlers/GlobalErrorHandler";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(urlencoded({ extended: true }));

app.use("/v1", router);
app.use(GlobalErrorHandler);

// Cria o servidor HTTP
const httpServer = createServer(app);

// Cria o Socket.IO e exporta
// Nesse socket eu defino o IO que recebe metodos como GET E Post e aceita apenas 
// da url do meu front end
export const io = new Server(httpServer, {
  cors: {
   origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

// Eventos Socket.IO
io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);
  

  // recebo o chatID das rotas de chat
  socket.on("joinChat", (chatId) => {
    // entro na sala com o chatID
    socket.join(chatId)
    console.log(`Socket ${socket.id} entrou na sala ${chatId}`)
  })

    socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Agora quem sobe é o httpServer, não o app
const PORT = process.env.PORT ?? 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
