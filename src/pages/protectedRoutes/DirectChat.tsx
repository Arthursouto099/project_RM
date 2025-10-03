import ChatAPi, { type Chat, type Message } from "@/api/ChatApi";
import type { CommonUser } from "@/api/UserApi";
import UserApi from "@/api/UserApi";
import { Send, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";


export function DirectChat() {
    const { id_user } = useParams<{ id_user: string }>()
    const [chat, setChat] = useState<Chat | null>(null)
    const [otherUser, setOtherUser] = useState<CommonUser | null>(null)
    const [content, setContent] = useState<string>("")
    const [messages , setMessages] = useState<Message[]>([])

    useEffect(() => {
        const getChat = async () => {
            const [userTwo, chat] = await Promise.all([
                (await UserApi.getUser(id_user!)).data,
                (await ChatAPi.createOrReturnChat(id_user!)).data
            ])

            setOtherUser(userTwo!)
            setChat(chat!)
        }

        getChat()
    }, [id_user])


    // useEffect(() => {
    //     const getMessages = async () => {
    //         const messages = await ChatAPi.getMessagesByChat({id_chat: chat?.id_chat ?? "", limit: 20, page: 1 })
    //     }
    // }, [])



    const sendMessage = async (content: string) => {
        const send = await ChatAPi.sendMessage({ id_chat: chat?.id_chat ?? "", content })
        console.log(send.data)
    }




    return (

        <section className="m-5 h-[95%] mb-10 bg-sidebar-accent/30 rounded-md flex text-sidebar-foreground  gap-5">
            <div className="w-full relative  p-5">
                <header className="w-full flex items-cente">
                    <div className="flex gap-4 items-center" >
                        {otherUser?.profile_image ? (
                            <img className="h-full w-full object-cover" src={otherUser?.profile_image} alt="" />) : (
                            <User2 className="text-neutral-500" />
                        )}
                        <h1>{otherUser?.username}</h1>
                    </div>
                </header>

                <div className="absolute bg-sidebar-accent flex gap-6 items-center justify-center p-3 w-full bottom-0 left-0">
                    <div className="w-[80%]">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full resize-none rounded-md bg-sidebar-accent px-4 py-2 text-sm placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
                            rows={1}
                            placeholder="Digite uma mensagem"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage(content);
                                    setContent("");
                                }
                            }}
                        />
                    </div>
                    <div>
                        <button className="cursor-pointer" onClick={async () => {
                            await sendMessage(content)
                            setContent("")
                        }}>
                            <Send />
                        </button>
                    </div>
                </div>



            </div>
        </section>

    )
}