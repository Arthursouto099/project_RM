import instanceV1 from "@/api/api@instance/ap-v1i";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Asterisk,
  Edit,
  MessageSquareIcon,
  SearchCode,
  Star,
  Trash2,
  Users,
  UsersRoundIcon,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { DialogCommunity } from "./CommunityCreate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

export type Community = {
  id_community: string;
  name: string;
  id_owner: string;
  description: string;
  community_image: string | null;
  createdAt: string;
  updatedAt: string;

  owner: {
    id_user: string;
    nickname: string;
    email: string;
    profile_image: string | null;
  };

  members: {
    id_user: string;
    nickname: string;
    email: string;
    profile_image: string | null;
  }[];

  chats: {
    id_chat: string;
    communityId: string;
    name: string | null;
    isGroup: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
};

export default function CommunityPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [, setLoading] = useState<boolean>(false);
  const [filters, setFilter] = useState<"news" | "my" | "parts">("news");

  const getCommunities = async () => {
    try {
      setLoading(true);
      const { data } = await instanceV1.get("/community/all", {
        withCredentials: true,
      });
      setCommunities(data.data);
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getMyCommunities = async () => {
    try {
      setLoading(true);
      const { data } = await instanceV1.get("/community/my/all", {
        withCredentials: true,
      });
      setCommunities(data.data);
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const getPartsCommunities = async () => {
    try {
      setLoading(true);
      const { data } = await instanceV1.get("/community/part/all", {
        withCredentials: true,
      });
      setCommunities(data.data);
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    switch (filters) {
      case "news":
        getCommunities();
        break;
      case "my":
        getMyCommunities();
        break;
      case "parts":
        getPartsCommunities();
        break;
    }
  }, [filters]);

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden bg-background"
      style={{
        backgroundImage:
          "url(/high-angle-shot-beautiful-forest-with-lot-green-trees-enveloped-fog-new-zealand.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* overlays */}
      <div className="absolute inset-0 bg-background/60 dark:bg-background/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80" />
      <div className="absolute -top-24 left-1/2 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-foreground/10 blur-3xl" />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col p-5 h-screen max-w-full mx-auto">
        <div className="w-full flex flex-col h-full p-2 md:p-5">
          <div className="rounded-2xl border border-foreground/10 min-h-full max-h-full bg-background/40 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden flex flex-col">
            {/* Cabeçalho */}
            <div className="p-6 md:p-10 max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
                Descubra comunidades e{" "}
                <span className="text-accent drop-shadow-sm">conecte-se</span>{" "}
                com pessoas
              </h1>

              <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                Explore grupos, encontre salas de conversa e participe de
                tópicos que fazem sentido para você.
              </p>

              {/* Tabs */}
              <div className="mt-6 flex flex-wrap relative z-80 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilter("news")}
                  className={`
                  inline-flex items-center  gap-2  rounded-sm cursor-pointer  px-4 py-2 text-xs font-medium
       
                  ${
                    filters === "news"
                      ? "bg-accent/70   flegap-2 text-foreground  border-accent/40 shadow-sm"
                      : "bg-background/40 text-foreground border-foreground/10 hover:bg-background/60"
                  }
                `}
                >
                  <UsersRoundIcon size={15} /> Novas
                </button>

                <button
                  type="button"
                  onClick={() => setFilter("my")}
                  className={`
                  inline-flex items-center   gap-2 rounded-sm  px-4 py-2 text-xs cursor-pointer font-medium
              
                  ${
                    filters === "my"
                      ? "bg-accent/70  text-foreground  border-accent/40 shadow-sm"
                      : "bg-background/40 text-foreground border-foreground/10 hover:bg-background/60"
                  }
                `}
                >
                  <Asterisk size={15} /> Minhas
                </button>

                <button
                  type="button"
                  onClick={() => setFilter("parts")}
                  className={`
                  inline-flex items-center   rounded-sm  px-4 py-2 text-xs cursor-pointer font-medium
                   gap-2
                  ${
                    filters === "parts"
                      ? "bg-accent/70  text-foreground  border-accent/40 shadow-sm"
                      : "bg-background/40 text-foreground border-foreground/10 hover:bg-background/60"
                  }
                `}
                >
                  <Star size={15} /> Participo
                </button>
              </div>
            </div>

            {/* Lista de Comunidades */}
            <div className="md:p-10 px-6 pb-6 flex-1 -mt-2 md:-mt-15 flex flex-col">
              <section
                className="
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                gap-5 md:gap-6
                overflow-y-auto
                rounded-xl
               
                no-scrollbar
              "
                style={{ maxHeight: "clamp(320px, 60vh, 720px)" }}
              >
                {communities.map((e) => (
                  <CommunityModal
                    onSuccess={async () => {
                      getCommunities();
                    }}
                    key={e.id_community}
                    data={e}
                  />
                ))}
              </section>

              {communities.length === 0 && (
                <div className="mt-10 rounded-2xl  min-h-[70%] flex items-center flex-col justify-center border border-foreground/10 bg-background/40 p-8 text-center">
                  <SearchCode size={59} className="mb-6 text-foreground/90" />
                  <p className="text-foreground font-medium">
                    Nenhuma comunidade encontrada.
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Assim que houver comunidades disponíveis, elas aparecerão
                    aqui.
                  </p>
                </div>
              )}
            </div>

            {/* barra inferior sutil */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

type CommunityModalProps = {
  data: Community;
  onSuccess: () => void;
};

export function CommunityModal({ data, onSuccess }: CommunityModalProps) {
  const initial = (data?.name?.[0] ?? "?").toUpperCase();
  const navigate = useNavigate();

  const joinCommunity = async () => {
    try {
      await instanceV1.patch(
        `/community/join/${data.id_community}`,
        {},
        { withCredentials: true },
      );
      toast.success("Sucesso ao entrar na comunidade");
      onSuccess();
    } catch (e) {
      console.log(e);
    }
  };

  const { user } = useAuth();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="
      group cursor-pointer
      rounded-2xl border border-foreground/10
      bg-background/40 backdrop-blur
      p-5
      shadow-sm
      
                transition-all duration-200
      hover:bg-background/60  hover:-translate-y-1
      focus-visible:outline-none focus-visible:ring-0 focus-visible:
    "
          role="button"
          tabIndex={0}
        >
          {/* Imagem */}
          {data.community_image ? (
            <div className="relative overflow-hidden rounded-xl border border-foreground/10">
              <img
                src={data.community_image}
                alt={data.name}
                className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>
          ) : (
            <div
              className="
          h-40 w-full rounded-xl border border-foreground/10
          bg-gradient-to-br from-foreground/10 to-foreground/5
          flex items-center justify-center
          text-foreground text-4xl font-semibold
        "
            >
              {initial}
            </div>
          )}

          <div className="mt-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                {data.name}
              </h3>

              <span className="shrink-0 text-[11px] rounded-full border border-foreground/10 bg-background/50 px-2 py-0.5 text-muted-foreground">
                Comunidade
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {data.description}
            </p>

            <div className="pt-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/50 px-3 py-1 text-xs cursor-pointer text-muted-foreground">
                <Users size={14} className="opacity-80" />
                <span>{data.members.length} membros</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/50 px-3 py-1 text-xs cursor-pointer text-muted-foreground">
                <MessageSquareIcon size={14} className="opacity-80" />
                <span>{data.chats.length} chats</span>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent
        className="
   
  rounded-2xl
  md:max-h-[94%]
  no-scrollbar
  overflow-y-auto
  overflow-x-auto
  border border-foreground/10
  bg-background/75 backdrop-blur-xl
  shadow-2xl
  p-0 
"
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xl text-white  font-semibold tracking-tight">
              {data.name}
            </DialogTitle>
          </DialogHeader>

          <p className="mt-2 text-sm text-foreground/70">{data.description}</p>
        </div>

        {/* Imagem */}
        {data.community_image && (
          <div className="px-6">
            <div className="relative h-52 w-full overflow-hidden rounded-xl border border-foreground/10">
              <img
                src={data.community_image}
                alt={data.name}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-6 pt-5 space-y-5">
          {/* Owner */}
          <div className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4">
            <h3 className="text-sm font-semibold text-foreground">
              Dono da comunidade
            </h3>

            <div className="mt-3 flex items-center gap-3">
              {data.owner.profile_image ? (
                <img
                  src={data.owner.profile_image}
                  alt={data.owner.nickname}
                  className="h-11 w-11 rounded-full object-cover ring-1 ring-foreground/10"
                />
              ) : (
                <div className="h-11 w-11 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-semibold">
                  {(data.owner.nickname?.[0] ?? "?").toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <p className="font-medium text-foreground leading-tight">
                  {data.owner.nickname}
                </p>
                <p className="text-xs text-foreground/60 truncate">
                  {data.owner.email}
                </p>
              </div>
            </div>
          </div>

          {/* Membros */}
          <div className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground">
                Membros ({data.members.length})
              </h3>
              <span className="text-xs text-foreground/50">
                Visualização rápida
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {data.members.map((member) => (
                <div
                  key={member.id_user}
                  className="
                    flex items-center gap-2
                    rounded-full border border-foreground/10
                    bg-background/60
                    px-3 py-1
                    shadow-sm
                  "
                >
                  {member.profile_image ? (
                    <img
                      src={member.profile_image}
                      alt={member.nickname}
                      className="h-7 w-7 rounded-full object-cover ring-1 ring-foreground/10"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-foreground/10 flex items-center justify-center text-foreground text-xs font-semibold">
                      {(member.nickname?.[0] ?? "?").toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-foreground/90">
                    {member.nickname}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chats */}
          <div className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground">
                Chats ({data.chats.length})
              </h3>
              <span className="text-xs text-foreground/50">Lista de salas</span>
            </div>

            <ul className="mt-3 space-y-2 max-h-10 overflow-y-auto no-scrollbar pr-1">
              {data.chats.map((chat) => (
                <li
                  key={chat.id_chat}
                  className="
                    flex items-center justify-between gap-3
                    rounded-lg border border-foreground/10
                    bg-background/60 px-3 py-2
                    text-sm
                  "
                >
                  <span className="text-foreground/90 truncate">
                    {chat.name || "Chat sem nome"}
                  </span>

                  {chat.isGroup && (
                    <span className="text-[11px] rounded-full border border-foreground/15 bg-foreground/[0.04] px-2 py-0.5 text-foreground/70">
                      Grupo
                    </span>
                  )}
                </li>
              ))}

              {data.chats.length === 0 && (
                <li className="text-sm text-foreground/60">
                  Nenhum chat disponível no momento.
                </li>
              )}
            </ul>
          </div>

          {/* Ações */}
          <div className="flex items-center text-white justify-end gap-2 pt-1">
            <div>
              {!data.members
                .map((u) => u.id_user)
                .includes(user?.id_user as string) && (
                <DialogClose asChild>
                  <Button
                    onClick={async () => {
                      await joinCommunity();
                    }}
                    variant={"secondary"}
                  >
                    Fazer Parte
                  </Button>
                </DialogClose>
              )}
            </div>

            <div>
              {data.members
                .map((u) => u.id_user)
                .includes(user?.id_user as string) && (
                <DialogClose asChild>
                  <Button
                    onClick={() =>
                      navigate("/community/page/" + data.id_community)
                    }
                    variant={"secondary"}
                  >
                    Acessar Comunidade
                  </Button>
                </DialogClose>
              )}
            </div>

            <div>
              {data.owner.id_user === (user?.id_user as string) && (
                <DialogCommunity
                  onSuccess={onSuccess}
                  initial={{
                    name: data.name,
                    id_community: data.id_community,
                    description: data.description,
                    community_image: data.community_image ?? undefined,
                  }}
                >
                  <Button variant={"secondary"} className="bg-accent/60">
                    <Edit /> Editar
                  </Button>
                </DialogCommunity>
              )}
            </div>

            {data.owner.id_user === (user?.id_user as string) && (
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"secondary"}
                      className="bg-red-400/60 hover:bg-red-300/60"
                    >
                      <Trash2 /> Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">
                        Você tem certeza que quer excluir essa comunidade?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground/70 ">
                        Todos os chats serão perdidos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-white">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          await instanceV1.delete(
                            `community/${data.id_community}`,
                            { withCredentials: true },
                          );
                          toast.success("Comunidade Deletada com Sucesso");
                          onSuccess();
                        }}
                        variant={"secondary"}
                        className="bg-accent/90 text-white"
                      >
                        Sim
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            <DialogClose asChild>
              <Button variant="ghost" className="rounded-xl">
                Fechar
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
