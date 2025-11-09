import { httpServer } from "./app";
import "./io_websocket/main_socket"

const PORT = process.env.PORT ?? 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
