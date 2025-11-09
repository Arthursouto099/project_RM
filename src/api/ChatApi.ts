import { isAxiosError } from "axios";
import instanceV1 from "./api@instance/ap-v1i";
import { tokenActions } from "@/@tokenSettings/token";
import type { CommonUser } from "./UserApi";



export type Chat = {
    updatedAt: Date;
    createdAt: Date;
    name: string | null;
    id_chat: string;
    isGroup: boolean; 
    messages?: Message[]
}

export type Message = {
        id_chat: string;
        id_sender: string;
        content: string;
        images: string[];
        videos: string[];
        createdAt: Date;
        updatedAt: Date;
        id_message: string;
        status:   "SENT" | "DELIVERED" | "READ";
        sender?: CommonUser
}

const ChatAPi = {
 


    createOrReturnChat: async (id_user: string) => {
        try {
            const token = tokenActions.getToken()
            const chatCreated = await instanceV1.post(`/chat/private/${id_user}`, {}, {headers: {Authorization: `bearer ${token}`}})
            return {
                message: chatCreated.data.message,
                success: true,
                data: chatCreated.data.data  as Chat
            }
        }
        catch (e) {
            if (isAxiosError(e)) {
                return {
                    message: e.response?.data?.message || "Erro ao conectar com o servidor",
                    success: false,
                    code: e.response?.status,
                    requestTime: new Date().toISOString(),
                };
            }

            return {
                message: "Erro inesperado",
                success: false,
                requestTime: new Date().toISOString(),
            };
        }
    },
      returnChat: async (id_user: string) => {
        try {
            const token = tokenActions.getToken()
            const chatCreated = await instanceV1.get(`/chat/private/${id_user}`, {headers: {Authorization: `bearer ${token}`}})
            return {
                message: chatCreated.data.message,
                success: true,
                data: chatCreated.data.data  as Chat
            }
        }
        catch (e) {
            if (isAxiosError(e)) {
                return {
                    message: e.response?.data?.message || "Erro ao conectar com o servidor",
                    success: false,
                    code: e.response?.status,
                    requestTime: new Date().toISOString(),
                };
            }

            return {
                message: "Erro inesperado",
                success: false,
                requestTime: new Date().toISOString(),
            };
        }
    },
    sendMessage: async ({id_chat, content} : {id_chat: string, content: string}) => {
        try {
            const token = tokenActions.getToken()
            const messageCreated = await instanceV1.post(`/chat/message`, {id_chat, content}, {headers: {Authorization: `bearer ${token}`}})
            console.log(messageCreated)
            return {
                message: messageCreated.data.message,
                success: true,
                data: messageCreated.data.data  as Message
            }
        }
        catch (e) {
            if (isAxiosError(e)) {
                return {
                    message: e.response?.data?.message || "Erro ao conectar com o servidor",
                    success: false,
                    code: e.response?.status,
                    requestTime: new Date().toISOString(),
                };
            }

            return {
                message: "Erro inesperado",
                success: false,
                requestTime: new Date().toISOString(),
            };
        }
    },
    getMessagesByChat: async ({id_chat, page = 1, limit = 20} : {id_chat: string, page: number, limit: number}) => {
        try {
            const token = tokenActions.getToken()
            const messages = await instanceV1.get(`/chat/${id_chat}/message?page=${page}&limit=${limit}` , {headers: {Authorization: `bearer ${token}`}})
            return {
                message: messages.data.message,
                success: true,
                data: messages.data.data  as Message[]
            }
        }
        catch (e) {
            if (isAxiosError(e)) {
                return {
                    message: e.response?.data?.message || "Erro ao conectar com o servidor",
                    success: false,
                    code: e.response?.status,
                    requestTime: new Date().toISOString(),
                };
            }

            return {
                message: "Erro inesperado",
                success: false,
                requestTime: new Date().toISOString(),
            };
        }
    }




}

export default ChatAPi