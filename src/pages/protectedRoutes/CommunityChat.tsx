import instanceV1 from "@/api/api@instance/ap-v1i";
import ChatAPi, { type Chat, type Message } from "@/api/ChatApi";
import type { CommonUser } from "@/api/UserApi";
import Avatar from "@/api_avatar";
import useAuth from "@/hooks/useAuth";
import { Send, User2, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

/**
 * ADAPTAÇÃO PARA CHAT EM GRUPO (vários usuários)
 *
 * - Remove chamadas atuais da API (deixa stubs com descrição do que faziam)
 * - Muda header para exibir nome do grupo + avatares de participantes
 * - Mantém paginação, scroll e socket (ajuste eventos se seu backend mudar)
 *
 * Rotas sugeridas:
 * - /chat/group/:id_chat
 */
export function GroupChat() {
  const { id_chat } = useParams<{ id_chat: string }>();

  const [chat, setChat] = useState<Chat | null>(null);
  const [participants, setParticipants] = useState<CommonUser[]>([]);
  const [content, setContent] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { user } = useAuth();
  const messagesRef = useRef<HTMLDivElement>(null);

  /**
   * ======= STUBS (SUBSTITUA PELAS NOVAS CHAMADAS) =======
   * Mantive assinatura parecida para você plugar fácil.
   */

  async function fetchGroupChatAndParticipants(chatId: string) {
    /**
     * Antes (direct):
     * - ChatAPi.createOrReturnChat(id_user)
     *   Criava ou retornava um chat direto entre o usuário logado e o id_user.
     *
     * Agora (grupo):
     * - Deve buscar detalhes do chat pelo id_chat:
     *   Ex: ChatApi.getChatById(chatId)
     *
     * - Deve buscar participantes do grupo:
     *   Ex: ChatApi.getParticipants(chatId) OU já vir junto no getChatById.
     */
    // TODO: implemente

    const { data } = await instanceV1.get(`/chat/${chatId}`, {
      withCredentials: true,
    });
    return {
      chat: data.data as Chat,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      participants: data.data.participants.map((p: { user: any }) => p.user),
    };
  }

  async function fetchMessagesByChat(
    chatId: string,
    page: number,
    limit: number,
  ) {
    /**
     * Antes:
     
     *   Buscava mensagens paginadas do chat.
     *
     * Agora:
     * - Mesma ideia (paginação de mensagens do grupo)
     */
    // TODO: implemente

    const data = await ChatAPi.getMessagesByChat({
      id_chat: chatId,
      page,
      limit,
    });

    return data.data;
  }

  async function sendMessageToChat(chatId: string, content: string) {
    /**
     * Antes:
     *
     * Agora:
     * - Mesma ideia (só muda endpoint/contrato se necessário)
     */
    // TODO: implemente
    await ChatAPi.sendMessage({ id_chat: chatId, content });
  }

  /**
   * ======= CARGA INICIAL (chat + participantes + msgs) =======
   */
  useEffect(() => {
    if (!id_chat) return;

    const getChat = async () => {
      // 1) Buscar chat + participantes
      const data = await fetchGroupChatAndParticipants(id_chat);
      setChat(data.chat);
      setParticipants(data.participants);

      // 2) Primeira página de mensagens
      const msgs = await fetchMessagesByChat(id_chat, 1, 10);
      setMessages(msgs ?? []);
      setPage(1);
      setHasMore(true);
    };

    getChat();
  }, [id_chat]);

  /**
   * Scroll inteligente ao receber/enviar mensagens
   */
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      if (isNearBottom || page === 1) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }, [messages, page]);

  /**
   * Paginação: carregar mensagens antigas quando page muda (page > 1)
   */
  useEffect(() => {
    if (!id_chat || page === 1) return;
    const el = messagesRef.current;
    if (!el) return;

    const prevScrollHeight = el.scrollHeight;

    const loadMessages = async () => {
      const msgs = await fetchMessagesByChat(id_chat, page, 10);

      if (!msgs || msgs.length === 0) {
        setHasMore(false);
        return;
      }

      setMessages((prev) => [...msgs, ...prev]);

      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight - prevScrollHeight;
      });
    };

    loadMessages();
  }, [page, id_chat]);

  /**
   * Socket.IO: entrar no chat e receber mensagens novas
   */
  useEffect(() => {
    if (!id_chat) return;

    const newSocket = io("http://localhost:3300"); // ajuste URL/env conforme seu projeto

    // Antes: newSocket.emit("joinChat", chat.id_chat)
    // Agora: entrar por id_chat do grupo
    newSocket.emit("joinChat", id_chat);

    newSocket.on("newMessage", (msg: Message) => {
      // Garantir que a msg é deste chat
      if (msg.id_chat === id_chat) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // opcional: recebido quando alguém visualiza (depende do seu backend)
    newSocket.on("chatViewed", (data) => {
      if (data.chatId === id_chat) {
        console.log("Alguém visualizou o chat", data.timestamp);
      }
    });

    // opcional: update de participantes (se seu backend emitir)
    // newSocket.on("participantsUpdated", (data) => {
    //   if (data.chatId === id_chat) setParticipants(data.participants);
    // });

    return () => {
      newSocket.off("newMessage");
      newSocket.off("chatViewed");
      // newSocket.off("participantsUpdated");
      newSocket.disconnect();
    };
  }, [id_chat]);

  /**
   * Detectar scroll top para paginação (carregar mensagens antigas)
   */
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

  /**
   * Enviar mensagem (grupo)
   */
  const onSend = async () => {
    if (!id_chat || !content.trim()) return;

    await sendMessageToChat(id_chat, content);
    setContent(""); // limpa textarea

    // Observação:
    // - se sua API retornar a mensagem criada, você pode dar append aqui
    // - ou confiar somente no socket "newMessage"
  };

  /**
   * Header helpers
   */
  const headerTitle = useMemo(() => {
    // Se o tipo Chat tiver campo "name", use. Caso contrário, fallback.
    const chatName = chat?.name as string | undefined;
    return chatName?.trim() ? chatName : "Chat em Grupo";
  }, [chat]);

  const participantsCount = participants.length;

  return (
    <section className=" w-full h-[100%] rounded-md flex text-sidebar-foreground gap-5">
      <div className="w-full h-full overflow-hidden relative p-5 flex flex-col">
        {/* Header (Grupo) */}
        <header className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
          <div className="flex gap-3 items-center min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center border border-border/40">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="leading-tight min-w-0">
              <h1 className="font-semibold text-sm truncate">{headerTitle}</h1>
              <p className="text-xs text-muted-foreground truncate">
                {participantsCount} participante
                {participantsCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {/* Avatares dos participantes (até 5) */}
          <div className="flex items-center -space-x-2">
            {participants.slice(0, 5).map((p) => (
              <div
                key={p.id_user}
                className="h-8 w-8 rounded-full border border-border/40 bg-background overflow-hidden"
                title={p.username}
              >
                <Avatar
                  name={p.username}
                  image={p.profile_image}
                  className="h-full w-full"
                />
              </div>
            ))}
            {participants.length > 5 ? (
              <div className="h-8 w-8 rounded-full border border-border/40 bg-muted flex items-center justify-center text-xs text-muted-foreground">
                +{participants.length - 5}
              </div>
            ) : null}
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
            .slice()
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            )
            .map((m, idx) => {
              const isMe = m.sender?.id_user === user?.id_user;

              return (
                <div
                  key={m.id_message ?? idx}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      isMe
                        ? "bg-sidebar-accent-foreground text-sidebar rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {/* Em grupo, quase sempre faz sentido mostrar remetente quando não é você */}
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

                    <p className="leading-relaxed whitespace-pre-line">
                      {m.content}
                    </p>

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
                  onSend();
                }
              }}
            />

            <button
              onClick={onSend}
              className="flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground hover:opacity-90 transition"
              aria-label="Enviar mensagem"
              type="button"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
