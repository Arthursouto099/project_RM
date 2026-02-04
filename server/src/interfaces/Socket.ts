import { DefaultEventsMap, Server } from "socket.io"


interface SinalWebSocketArgs {
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    args?: any | Promise<any>
    toString: string
    emitString: string
}


// normalizando a forma no qual eu emito sinais com web socket
const emitSinalByWebSocket = async ({ toString, emitString, args, io }: SinalWebSocketArgs): Promise<void> => {
    const finalArgs = args ? await args : null
    io.to(toString).emit(emitString, finalArgs)
}


export {
    SinalWebSocketArgs,
    emitSinalByWebSocket
}