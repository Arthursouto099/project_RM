import ChatAPi, { type Chat, type Message } from "@/api/ChatApi";
import type { CommonUser } from "@/api/UserApi";
import UserApi from "@/api/UserApi";
import Avatar from "@/api_avatar";
import useAuth from "@/hooks/useAuth";
import { Send, User2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

export function DirectChat() {
  const { id_user } = useParams<{ id_user: string }>();
  const [chat, setChat] = useState<Chat | null>(null);
  const [otherUser, setOtherUser] = useState<CommonUser | null>(null);
  const [content, setContent] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { user } = useAuth();
  const messagesRef = useRef<HTMLDivElement>(null);

  // Buscar chat e mensagens iniciais
  useEffect(() => {
    const getChat = async () => {
      const [userTwo, chatData] = await Promise.all([
        (await UserApi.getUser(id_user!)).data,
        (await ChatAPi.createOrReturnChat(id_user!)).data,
      ]);

      setOtherUser(userTwo!);
      setChat(chatData!);

      // primeira carga (página 1)
      const msgs = (
        await ChatAPi.getMessagesByChat({
          id_chat: chatData?.id_chat ?? "",
          page: 1,
          limit: 10,
        })
      ).data;

      setMessages(msgs ?? []);
    };

    getChat();
  }, [id_user]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;

    // sempre que novas mensagens forem adicionadas (enviadas/recebidas)
    // o scroll vai pro final, MAS somente se for a última página
    // ou se a nova mensagem for a mais recente
    requestAnimationFrame(() => {
      // garante que o scroll só desce se o usuário estiver no final
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      if (isNearBottom || page === 1) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }, [messages, page]);

  // Paginação: carregar mensagens antigas ao mudar a página
  useEffect(() => {
    if (!chat?.id_chat || page === 1) return;
    const el = messagesRef.current;
    if (!el) return;

    const prevScrollHeight = el.scrollHeight;

    const loadMessages = async () => {
      const msgs = (
        await ChatAPi.getMessagesByChat({
          id_chat: chat.id_chat,
          page,
          limit: 10,
        })
      ).data;

      if (!msgs || msgs.length === 0) {
        setHasMore(false);
        return;
      }

      setMessages((prev) => [...(msgs ?? []), ...prev]);

      // manter o scroll no mesmo ponto após carregar
      requestAnimationFrame(() => {
        if (el) {
          el.scrollTop = el.scrollHeight - prevScrollHeight;
        }
      });
    };

    loadMessages();
  }, [page, chat?.id_chat]);

  // Conectar Socket.IO quando o chat estiver carregado
  useEffect(() => {
    if (!chat?.id_chat) return;

    const newSocket = io("http://localhost:3300"); // porta do backend

    newSocket.emit("joinChat", chat.id_chat);

    newSocket.on("newMessage", (msg: Message) => {
      if (msg.id_chat === chat.id_chat) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    newSocket.on("chatViewed", (data) => {
      if (data.chatId === chat.id_chat) {
        console.log("Alguém visualizou o chat", data.timestamp);
      }
    });

    return () => {
      newSocket.off("newMessage");
      newSocket.off("chatViewed");
      newSocket.disconnect();
    };
  }, [chat?.id_chat]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop === 0 && hasMore) {
        setPage((prev) => prev + 1);
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  // Enviar mensagem
  const sendMessage = async (content: string) => {
    if (!chat?.id_chat || !content.trim()) return;

    await ChatAPi.sendMessage({
      id_chat: chat.id_chat,
      content,
    });

    setContent(""); // limpa textarea
  };

  return (
    <section className="  w-full h-[100%]  rounded-md flex text-sidebar-foreground gap-5">
      <div className="w-full h-full overflow-hidden relative p-5 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
          <div className="flex gap-3 items-center">
            <Avatar
              name={otherUser?.username}
              image={otherUser?.profile_image}
            />
            <div className="leading-tight">
              <h1 className="font-semibold text-sm">{otherUser?.username}</h1>
              <p className="text-xs text-muted-foreground">
                {otherUser?.nickname}
              </p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={messagesRef}
          className="flex-1 overflow-auto no-scrollbar flex flex-col gap-3 mb-28 px-2"
        >
          {hasMore && (
            <p className="text-center text-[11px] text-muted-foreground">
              Role para cima para carregar mais
            </p>
          )}

          {messages
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            )
            .map((m, idx) => {
              const isMe = m.sender?.id_user === user?.id_user;

              return (
                <div
                  key={idx}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      isMe
                        ? "bg-sidebar-accent-foreground  text-sidebar rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {!isMe && (
                      <div className="flex items-center gap-2 mb-1">
                        {m.sender?.profile_image ? (
                          <img
                            className="h-4 w-4 rounded-full object-cover"
                            src={m.sender.profile_image}
                            alt=""
                          />
                        ) : (
                          <User2 className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {m.sender?.username}
                        </span>
                      </div>
                    )}

                    <p className="leading-relaxed">{m.content}</p>

                    <div className="mt-1 text-right text-[10px] text-muted-foreground">
                      {m.createdAt
                        ? new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Input */}
        <div className="absolute bottom-0 left-0 w-full border-t border-border/40 bg-background/80 backdrop-blur p-3">
          <div className="flex items-center gap-3">
            <Avatar
              name={user?.username}
              image={user?.profile_image}
              className="h-8 w-8"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={1}
              placeholder="Digite uma mensagem..."
              className="flex-1 resize-none rounded-full bg-muted px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(content);
                }
              }}
            />

            <button
              onClick={() => sendMessage(content)}
              className="flex h-9 w-9 items-center justify-center rounded-full  text-primary-foreground hover:opacity-90 transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
