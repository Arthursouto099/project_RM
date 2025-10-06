import ChatAPi, { type Chat, type Message } from "@/api/ChatApi"
import type { CommonUser } from "@/api/UserApi"
import UserApi from "@/api/UserApi"
import useAuth from "@/hooks/useAuth"
import { Send, User2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { io, Socket } from "socket.io-client"

export function DirectChat() {
  const { id_user } = useParams<{ id_user: string }>()
  const [chat, setChat] = useState<Chat | null>(null)
  const [otherUser, setOtherUser] = useState<CommonUser | null>(null)
  const [content, setContent] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const { payload } = useAuth()
  const messagesRef = useRef<HTMLDivElement>(null)

  // Buscar chat e mensagens iniciais
  useEffect(() => {
    const getChat = async () => {
      const [userTwo, chatData] = await Promise.all([
        (await UserApi.getUser(id_user!)).data,
        (await ChatAPi.createOrReturnChat(id_user!)).data,
      ])

      setOtherUser(userTwo!)
      setChat(chatData!)

      // primeira carga (página 1)
      const msgs = (
        await ChatAPi.getMessagesByChat({
          id_chat: chatData?.id_chat ?? "",
          page: 1,
          limit: 10,
        })
      ).data

      setMessages(msgs ?? [])
    }

    getChat()
  }, [id_user])

  
  useEffect(() => {
    const el = messagesRef.current
    if (!el) return

    // sempre que novas mensagens forem adicionadas (enviadas/recebidas)
    // o scroll vai pro final, MAS somente se for a última página
    // ou se a nova mensagem for a mais recente
    requestAnimationFrame(() => {
      // garante que o scroll só desce se o usuário estiver no final
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100
      if (isNearBottom || page === 1) {
        el.scrollTop = el.scrollHeight
      }
    })
  }, [messages, page])

  // Paginação: carregar mensagens antigas ao mudar a página
  useEffect(() => {
    if (!chat?.id_chat || page === 1) return
    const el = messagesRef.current
    if (!el) return

    const prevScrollHeight = el.scrollHeight

    const loadMessages = async () => {
      const msgs = (
        await ChatAPi.getMessagesByChat({
          id_chat: chat.id_chat,
          page,
          limit: 10,
        })
      ).data

      if (!msgs || msgs.length === 0) {
        setHasMore(false)
        return
      }

      setMessages((prev) => [...(msgs ?? []), ...prev])

      // manter o scroll no mesmo ponto após carregar
      requestAnimationFrame(() => {
        if (el) {
          el.scrollTop = el.scrollHeight - prevScrollHeight
        }
      })
    }

    loadMessages()
  }, [page, chat?.id_chat])

  // Conectar Socket.IO quando o chat estiver carregado
  useEffect(() => {
    if (!chat?.id_chat) return

    const newSocket = io("http://localhost:3300") // porta do backend
    setSocket(newSocket)

    newSocket.emit("joinChat", chat.id_chat)

    newSocket.on("newMessage", (msg: Message) => {
      if (msg.id_chat === chat.id_chat) {
        setMessages((prev) => [...prev, msg])

      }
    })

    newSocket.on("chatViewed", (data) => {
      if (data.chatId === chat.id_chat) {
        console.log("Alguém visualizou o chat", data.timestamp)
      }
    })

    return () => {
      newSocket.off("newMessage")
      newSocket.off("chatViewed")
      newSocket.disconnect()
    }
  }, [chat?.id_chat])

  // Listener de scroll: carrega mais quando chega no topo
  useEffect(() => {
    const el = messagesRef.current
    if (!el) return

    const handleScroll = () => {
      if (el.scrollTop === 0 && hasMore) {
        setPage((prev) => prev + 1)
      }
    }

    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [hasMore])

  // Enviar mensagem
  const sendMessage = async (content: string) => {
    if (!chat?.id_chat || !content.trim()) return

    await ChatAPi.sendMessage({
      id_chat: chat.id_chat,
      content,
    })

    setContent("") // limpa textarea
  }

  return (
    <section className="m-5 h-[95%] bg-sidebar-accent/30 rounded-md flex text-sidebar-foreground gap-5">
      <div className="w-full h-full overflow-hidden relative p-5 flex flex-col">
        {/* Header */}
        <header className="w-full flex items-center mb-4 border-b border-gray-300 pb-2">
          <div className="flex gap-4 items-center">
            {otherUser?.profile_image ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={otherUser?.profile_image}
                alt=""
              />
            ) : (
              <User2 className="text-neutral-500 h-10 w-10" />
            )}
            <div>
              <h1 className="font-semibold">{otherUser?.username}</h1>
              <p className="text-sm text-sidebar-foreground/70">
                {otherUser?.nickname}
              </p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={messagesRef}
          className="flex-1 overflow-auto no-scrollbar flex flex-col gap-2 mb-24 px-1"
        >
          {hasMore && (
            <p className="text-center text-xs text-gray-500">
              Role para cima para carregar mais
            </p>
          )}

          {messages
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((m, idx) => {
              const isMe = m.sender?.id_user === payload?.id_user
              return (
                <div
                  key={idx}
                  className={`max-w-[70%] p-3 rounded-xl break-words ${isMe
                      ? "bg-gray-200 text-black self-end rounded-br-none"
                      : "bg-gray-200 text-black self-start rounded-bl-none"
                    }`}
                >
                  {!isMe && (
                    <div className="flex items-center gap-2 mb-1">
                      {m.sender?.profile_image ? (
                        <img
                          className="h-5 w-5 rounded-full object-cover"
                          src={m.sender.profile_image}
                          alt=""
                        />
                      ) : (
                        <User2 className="text-gray-500 h-5 w-5" />
                      )}
                      <h2 className="text-xs font-medium">
                        {m.sender?.username}
                      </h2>
                    </div>
                  )}
                  <p className="text-sm">{m.content}</p>
                  <div className="text-right text-xs mt-1 text-gray-500">
                    {m.createdAt
                      ? new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : ""}
                  </div>
                </div>
              )
            })}
        </div>

        {/* Input */}
        <div className="absolute bottom-0 left-0 w-full bg-sidebar-accent p-3 flex items-center gap-3 border-t border-gray-300">
          <button className="text-gray-500 hover:text-gray-700">
            <User2 />
          </button>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 resize-none rounded-full px-4 py-2 text-sm text-sidebar-foreground placeholder-gray-400 border-sidebar-foreground border focus:outline-none focus:ring-1 focus:accent-accent"
            rows={1}
            placeholder="Digite uma mensagem"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage(content)
              }
            }}
          />
          <button
            className="bg-accent p-2 rounded-full cursor-pointer text-white hover:bg-accent/20"
            onClick={() => sendMessage(content)}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
