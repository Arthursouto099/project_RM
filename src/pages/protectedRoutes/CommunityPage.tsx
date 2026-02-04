import { useNavigate, useParams } from "react-router-dom";
export type ChatRole = "ADMIN" | "MEMBER" | "MODERATOR";
import  { useEffect, useState } from "react";
import { Users, MessageSquare, ShieldCheck } from "lucide-react";
import instanceV1 from "@/api/api@instance/ap-v1i";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export type ChatListItem = {
  id_chat: string;
  communityId: string;
  name: string;
  isGroup: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  messages: unknown[]; // se tiver tipo de message, troque aqui

  community: {
    id_community: string;
    name: string;
    id_owner: string;
    description: string;
    community_image: string;
    createdAt: string; // ISO
    updatedAt: string; // ISO
  };

  participants: Array<{
    id_chat: string;
    id_user: string;
    joinedAt: string; // ISO
    role: ChatRole;
  }>;
};

export default function CommunityPageHome() {
  const { id_community } = useParams<{ id_community: string }>();
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const navigate = useNavigate();

  const getChats = async () => {
    try {
      const { data } = await instanceV1.get(
        `/community/chats/${id_community}`,
        { withCredentials: true },
      );
      setChats(data.data);
    } catch {
      console.log("e");
    } finally {
      console.log("success");
    }
  };

  useEffect(() => {
    getChats();
  }, [id_community]);

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden bg-black "
      style={{
        backgroundImage:
          "url(/high-angle-shot-beautiful-forest-with-lot-green-trees-enveloped-fog-new-zealand.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* overlays */}
      <div className="absolute inset-0 bg-black/55 dark:bg-black/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/70" />
      <div className="absolute -top-24 left-1/2 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-col p-10 text-white h-screen md:w-8xl m-auto  ">
        <div>
          <CreateChatModal
            id_community={id_community as string}
            onSuccess={async () => await getChats()}
          />
        </div>
        <div className="mt-10 flex flex-col gap-4 no-scrollbar overflow-y-auto">
          {chats.map((c) => (
            <ChatAccessCard
              key={c.id_chat}
              chat={c}
              onClick={async (chat) => {
                try {
                  await instanceV1.patch(
                    `/chat/join/${chat.id_chat}`,
                    {},
                    { withCredentials: true },
                  );
                } catch {
                  toast.error("Erro ao entrar no chat");
                }

                // TODO: sua lógica aqui (navegar, setar chat atual, abrir tela etc.)
                navigate(`/community/chat/${chat.id_chat}`);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type Props = {
  chat: ChatListItem;
  onClick?: (chat: ChatListItem) => void;
};

export function CreateChatModal({
  onSuccess,
  id_community,
}: {
  onSuccess: () => void;
  id_community: string;
}) {
  const [name, setName] = useState<string>("");

  const onSave = async () => {
    try {
      await instanceV1.patch(
        `/community/add/chat/${id_community}`,
        { name },
        { withCredentials: true },
      );
      toast.success("Sucesso ao criar chat");
    } catch {
      toast.error("Você não possui essa permissão");
    }
    onSuccess();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="bg-accent/70 text-foreground">
          Criar Novo Chat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-foreground">Criar Novo Chat</DialogTitle>
        <DialogDescription>Chat de conversa</DialogDescription>

        <div className="flex flex-col gap-3 mt-2">
          <Label className="text-foreground/70">Nome (comunidade)</Label>
          <Input
            className="focus-visible:outline-none focus-visible:ring-0 ring-0 text-foreground focus-visible:shadow-none"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <DialogClose asChild>
            <Button
              onClick={onSave}
              variant={"secondary"}
              className="bg-accent/60 text-foreground"
            >
              Criar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ChatAccessCard({ chat, onClick }: Props) {
  const participantsCount = chat.participants?.length ?? 0;
  const isAdmin = chat.participants?.some((p) => p.role === "ADMIN") ?? false;

  return (
    <button
      type="button"
      onClick={() => onClick?.(chat)}
      className="
        group w-full text-left
        rounded-2xl
        border border-sidebar-border
        bg-sidebar/50
        p-4
        cursor-pointer
        shadow-sm
        hover:shadow-md
        hover:bg-sidebar/60
        transition
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-sidebar-accent
      "
      aria-label={`Abrir chat ${chat.name}`}
    >
      <div className="flex items-start gap-4">
        {/* Thumb da comunidade */}
        <div
          className="
            relative
            h-12 w-12
            overflow-hidden
            rounded-xl
            border border-sidebar-border
            bg-black/5
            shrink-0
          "
        >
          {/* Vite: img normal */}
          <img
            src={chat.community.community_image}
            alt={chat.community.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* Cabeçalho */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold text-base">
                  {chat.name}
                </h3>

                {isAdmin ? (
                  <span
                    className="
                      inline-flex items-center gap-1
                      rounded-full
                      border border-sidebar-border
                      bg-sidebar/60
                      px-2 py-0.5
                      text-[11px]
                      text-muted-foreground
                    "
                    title="Você é administrador"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    ADMIN
                  </span>
                ) : null}
              </div>

              <p className="truncate text-sm text-muted-foreground">
                {chat.community.name} • {chat.community.description}
              </p>
            </div>

            {/* Indicador */}
            <div
              className="
                inline-flex items-center gap-1
                rounded-full
                border border-sidebar-border
                bg-sidebar/60
                px-2 py-1
                text-xs text-muted-foreground
                shrink-0
              "
              title={chat.isGroup ? "Chat em grupo" : "Chat privado"}
            >
              {chat.isGroup ? (
                <>
                  <Users className="h-4 w-4" />
                  Grupo
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4" />
                  Direto
                </>
              )}
            </div>
          </div>

          {/* Rodapé (métricas) */}
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="
                inline-flex items-center gap-1
                rounded-full
                border border-sidebar-border
                bg-sidebar/40
                px-2 py-1
              "
            >
              <Users className="h-3.5 w-3.5" />
              {participantsCount} participante
              {participantsCount === 1 ? "" : "s"}
            </span>

            <span
              className="
                inline-flex items-center gap-1
                rounded-full
                border border-sidebar-border
                bg-sidebar/40
                px-2 py-1
              "
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {chat.messages?.length ?? 0} mensagem
              {(chat.messages?.length ?? 0) === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
