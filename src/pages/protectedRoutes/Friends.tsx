import type { CommonUser, FriendRequest } from "@/api/UserApi";
import UserApi from "@/api/UserApi";
import useAuth from "@/hooks/useAuth";

import { toast } from "sonner";

import {
  Bell,
  Calendar,
  CalendarArrowUp,
  CheckCheck,
  Clock,
  MessageSquare,
  Search,
  SearchX,
  SendToBack,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChatAPi, { type Chat } from "@/api/ChatApi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Avatar from "@/api_avatar";
import { Input } from "@/components/ui/input";

export default function Friends() {
  const [field, setFields] = useState<"pedidos" | "usuarios" | "amigos">(
    "usuarios",
  );
  const [requests, setRequest] = useState<FriendRequest[]>([]);
  const [page] = useState<number>(1);
  const [users, setUsers] = useState<CommonUser[]>([]);
  const [fill, setFill] = useState<string>("");
  const { user } = useAuth();
  const active = true;

  const GetUsers = useCallback(async () => {
    try {
      const request = await UserApi.getUsers(page, 50);
      if (!active) return;

      const newUsers = request.data ?? [];

      setUsers((prev) => {
        const map = new Map(prev.map((u) => [u.id_user, u]));

        for (const user of newUsers) {
          map.set(user.id_user, user);
        }

        return Array.from(map.values());
      });
    } catch (err) {
      console.error("Erro ao buscar usuários", err);
    }
  }, [active, page]);

  useEffect(() => {
    if (!user?.id_user) return;
    GetUsers();
  }, [GetUsers, page, user?.id_user]);

  // const filterUsers = users.filter((u) => {
  //   if (u.friends?.map((us) => us.id_user).includes(user?.id_user)) {
  //     return true;
  //   }
  // });

  const filter =
    fill && fill !== ""
      ? users.filter((u) =>
          u.username.toUpperCase().includes(fill.toUpperCase()),
        )
      : users;

  const getRequest = async () => {
    const request = await UserApi.getFriendRequest();
    setRequest(request.data?.filter((d) => d.status === "pending") ?? []);
  };

  useEffect(() => {
    getRequest();
  }, []);

  return (
    <section className="flex w-full overflow-hidden text-sidebar-foreground  gap-5">
      <div className="w-full h-full m-5">
        <header className="w-full">
          <div className="w-[100%] ">
            <div className="relative flex">
              <Search
                size={15}
                className="absolute text-foreground/70  top-2 right-4"
              />
              <Input
                className="w-full focus:ring-0 rounded-md border mb-5 p-2"
                onChange={(e) => {
                  setFill(e.target.value);
                }}
                placeholder="Digite o nome do úsuario..."
                type="text"
                name=""
                id=""
              />
            </div>
            <div className="flex gap-3  mb-4">
              <div className="relative inline-flex items-center gap-1">
                {/* Ícone com notificação */}
                <div className="relative">
                  <Bell size={13} />
                  {requests.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </div>

                {/* Título */}
                <h1
                  onClick={() => setFields("pedidos")}
                  className={`cursor-pointer text-sm pb-1 border-b-2 transition-colors
                ${
                  field === "pedidos"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                >
                  Pedidos
                </h1>
              </div>

              <div className="relative inline-flex items-center gap-1">
                {/* Ícone com notificação */}
                <div className="relative">
                  <Users size={13} />
                </div>

                {/* Título */}
                <h1
                  onClick={() => setFields("usuarios")}
                  className={`cursor-pointer text-sm pb-1 border-b-2 transition-colors
                ${
                  field === "usuarios"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                >
                  Usuarios
                </h1>
              </div>

              <div className="relative inline-flex items-center gap-1">
                {/* Ícone com notificação */}
                <div className="relative">
                  <Users size={13} />
                </div>

                {/* Título */}
                <h1
                  onClick={() => setFields("amigos")}
                  className={`cursor-pointer text-sm pb-1 border-b-2 transition-colors
                ${
                  field === "amigos"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                >
                  Amigos
                </h1>
              </div>
            </div>

            {field === "usuarios" && (
              <div>
                <div className="flex flex-col gap-3 overflow-auto no-scrollbar h-[80vh]">
                  {filter
                    .filter((u) => u.id_user !== user!.id_user)
                    .filter(
                      (us) =>
                        !us.friends
                          ?.map((user) => user.id_user)
                          .includes(user?.id_user),
                    )
                    .map((u) => (
                      <CardUserFriend key={u.id_user} commonUser={u} />
                    ))}
                </div>
              </div>
            )}

            {field === "pedidos" && requests.length > 0 ? (
              <div className="flex flex-col gap-3 overflow-auto no-scrollbar h-[68vh]">
                {requests.map((req) => (
                  <CardRequest
                    onSuccess={async () => {
                      await getRequest();
                    }}
                    key={req.id_request}
                    request={req}
                  />
                ))}
              </div>
            ) : field === "pedidos" ? (
              <div className="bg-black/40 min-h-[700px] p-5  rounded-md border-2 border-dotted flex flex-col items-center justify-center gap-4">
                <SearchX className="w-7 h-7 text-gray-400" />
                <h1 className="text-[17px] text-sidebar-foreground/50 text-center">
                  Você não possui nenhuma solicitação!
                </h1>
              </div>
            ) : null}

            {field === "amigos" && (
              <div>
                <div className="flex flex-col gap-3 overflow-auto no-scrollbar h-[80vh]">
                  {filter
                    .filter((u) => u.id_user !== user!.id_user)
                    .filter((us) =>
                      us.friends
                        ?.map((user) => user.id_user)
                        .includes(user?.id_user),
                    )
                    .map((u) => (
                      <CardUserFriend key={u.id_user} commonUser={u} />
                    ))}
                </div>
              </div>
            )}
          </div>
        </header>
      </div>
    </section>
  );
}

function CardUserFriend({ commonUser }: { commonUser: CommonUser }) {
  const { user } = useAuth();

  const sendFriendRequest = async (id_user: string) => {
    const r = await UserApi.sendFriendRequest(id_user);
    if (r.code === 200) {
      toast.success("Pedido enviado com sucesso!");
      return;
    }

    toast.error(r.message);
  };

  return (
    <div className="w-full p-5 border  rounded-md bg-sidebar-accent/30 ">
      <div className="flex gap-3 items-center">
        <div className=" flex gap-3 items-center ">
          <div>
            <Avatar
              image={commonUser.profile_image}
              name={commonUser.username}
            />
          </div>
          <div className="flex w-full flex-col leading-tight">
            <div className=" flex justify-between">
              <div className="flex  flex-col ">
                <h2 className="text-neutral-500 text-xs">
                  {commonUser.nickname}
                </h2>
                <h1 className="font-semibold text-foreground/70  text-xs">
                  {commonUser.username}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!commonUser.friends?.map((us) => us.id_user).includes(user?.id_user) && (
        <div className="mt-2">
          <button
            className="p-2 rounded-md text-foreground/70 text-sm flex items-center gap-2 hover:bg-sidebar-accent/90 cursor-pointer"
            onClick={() => {
              if (!commonUser.id_user) return;
              sendFriendRequest(commonUser.id_user);
            }}
          >
            <div className="flex items-center text-sm gap-2">
              <SendToBack size={16} /> Enviar solicitação
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export function CardFriend({ friend }: { friend: CommonUser }) {
  const [chat, setChat] = useState<Chat | null>(null);

  const createOrGetChat = async (id_user: string) => {
    const chat = (await ChatAPi.createOrReturnChat(id_user)).data;

    return chat;
  };

  const getChat = async (id_user: string) => {
    const chat = (await ChatAPi.returnChat(id_user)).data;
    setChat(chat ?? null);
  };

  useEffect(() => {
    getChat(friend.id_user!);
  }, [friend.id_user]);

  return (
    <Card className="w-full -p-3 p-4  h-full rounded-md bg-sidebar-accent/30 relative">
      <CardHeader className="">
        <div className=" pb-2">
          <div className="flex text-sm text-sidebar-foreground/30 items-center gap-2">
            <CalendarArrowUp className="w-4" />
            <h1 className="">
              Chat criado em{" "}
              {chat?.createdAt
                ? new Date(chat.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "data desconhecida"}
            </h1>
          </div>
        </div>

        <div className="flex  gap-3 items-center">
          <Avatar image={friend.profile_image} name={friend.username} />

          <div className="flex w-full flex-col leading-tight">
            <div className=" flex justify-between">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold ">{friend.username}</h1>
                <h2 className="text-neutral-500">{friend.nickname}</h2>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="-mt-3">
        {chat && chat.messages && chat.messages[0] ? (
          <div className="pt-2 pb-2 ">
            <div className=" flex items-center gap-2 text-sidebar-foreground/30 pb-2">
              <Clock className="w-4" />
              <h2 className="text-xs">Ultima mensagem enviada</h2>
            </div>
            <h1 className="text-md text-sidebar-foreground/60">
              {chat.messages[0].content ?? ""}
            </h1>
            <div className="text-sm text-sidebar-foreground/30">
              <h1 className="">
                enviada em{" "}
                {chat?.messages[0]
                  ? new Date(chat.messages[0].createdAt).toLocaleDateString(
                      "pt-BR",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : "data desconhecida"}
              </h1>
            </div>
          </div>
        ) : null}

        <div className="flex gap-3">
          <Link
            onClick={async () => {
              await createOrGetChat(friend.id_user!);
            }}
            to={`/direct/${friend.id_user}`}
            className="p-2  rounded-md text-sm text-foreground/70 flex items-center jus gap-2 hover:bg-sidebar-accent/90 cursor-pointer"
          >
            <MessageSquare /> Abrir Chat
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function CardRequest({
  request,
  onSuccess,
}: {
  request: FriendRequest;
  onSuccess: () => void;
}) {
  const acceptRequest = async (id_request: string) => {
    const r = await UserApi.acceptFriendRequest(id_request);
    if (r.code === 200) {
      toast.success(r.message);
      return;
    }

    toast.error(r.message);
  };

  return (
    <div className="w-full p-5 rounded-md bg-sidebar-accent/30  relative s">
      <div className=" flex gap-3 items-center ">
        <div>
          <Avatar
            image={request.requester.profile_image}
            name={request.requester.username}
          />
        </div>
        <div className="flex w-full flex-col leading-tight">
          <div className=" flex justify-between">
            <div className="flex  flex-col ">
              <h2 className="text-neutral-500 text-xs">
                {request.requester.nickname}
              </h2>
              <h1 className="font-semibold text-foreground/70  text-xs">
                {request.requester.username}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center mt-4 gap-2 text-neutral-500 text-sm">
        <Calendar className="w-3 h-3" />
        <span className="text-xs">
          {new Date(request.createdAt!).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="mt-1 flex gap-1">
        <button
          className="p-2 text-foreground/60 rounded-md text-xs flex items-center  gap-2  hover:bg-sidebar-accent/90 cursor-pointer"
          onClick={async () => {
            await acceptRequest(request.id_request);
            onSuccess();
          }}
        >
          {" "}
          <CheckCheck size={17} /> Aceitar{" "}
        </button>
        <button
          className="p-2 text-foreground/60 rounded-md text-xs flex items-center gap-2  hover:bg-sidebar-accent/90 cursor-pointer"
          onClick={async () => {
            try {
              await UserApi.denyFriendRequest(request.id_request);
              toast.success("Solicitação negado com sucesso");
              onSuccess();
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
              toast.error(e?.message);
            }
          }}
        >
          {" "}
          <X size={17} /> Rejeitar{" "}
        </button>
      </div>
    </div>
  );
}
