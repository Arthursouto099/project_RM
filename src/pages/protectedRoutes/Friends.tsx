import type { CommonUser, FriendRequest } from "@/api/UserApi";
import UserApi from "@/api/UserApi";
import useAuth, { type Payload } from "@/hooks/useAuth";

import { toast, ToastContainer } from "react-toastify"


import { Calendar, CalendarArrowUp, CheckCheck, Clock, MessageSquare, Search, SearchX, SendToBack, User2, X, } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChatAPi, { type Chat } from "@/api/ChatApi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Avatar from "@/api_avatar";





export default function Friends() {
  const [field, setFields] = useState<"pedidos" | "usuarios" | "amigos">("usuarios")
  const [requests, setRequest] = useState<FriendRequest[]>([])
  const [page, ] = useState<number>(1)
  const [users, setUsers] = useState<CommonUser[]>([])
  const [fill, setFill] = useState<string>("")
  const { payload } = useAuth()

  useEffect(() => {
    const getUsers = async () => {
      const request = await UserApi.getUsers(page, 10);
      setUsers(prev => {
        const users = request.data ?? []
        const fill = users.filter(np => !prev.some(u => u.id_user === np.id_user))
        return [...prev, ...fill]

      })
    }

    getUsers()
  }, [page])



   const filter = fill && fill !== "" ? users.filter(u => u.username.toUpperCase().includes(fill.toUpperCase())) : users 





  useEffect(() => {
    const getRequest = async () => {
      const request = await UserApi.getFriendRequest()
      setRequest(request.data?.filter((d) => d.status === "pending") ?? [])
    }

    getRequest()
  }, [])


  return (

    <section className="flex w-full overflow-hidden text-sidebar-foreground  gap-5">
      <div className="w-full h-full m-5">
      <header className="w-full">
       
        <div className="w-[100%] relative">


          <div className="flex gap-3 mt-4 mb-4">
            <h1 className={`border-t-0 cursor-pointer border-l-0 border-r-0 ${field && field === "pedidos" ? "border-b-accent border-2" : ""} `} onClick={() => setFields("pedidos")}>Pedidos</h1>
            <h1 className={`border-t-0 cursor-pointer border-l-0 border-r-0 ${field && field === "usuarios" ? "border-b-accent border-2" : ""} `} onClick={() => setFields("usuarios")} >Usuarios</h1>
          </div>

          <Search className="absolute  top-13 right-4" />
          <input className="w-full rounded-md border mb-5 p-2" onChange={(e) => {
            setFill(e.target.value)
          }} placeholder="@usuario" type="text" name="" id="" />


          {field === "usuarios" && (
            <div>



              <div className="flex flex-col gap-3 overflow-auto no-scrollbar h-[80vh]" >
                {filter.filter((u) => u.id_user !== (payload as Payload).id_user).map((u) => (
                  <CardUserFriend key={u.id_user} commonUser={u} />
                ))}




              </div>

              {/* <div className="p-3" >
                <button className="bg-sidebar-accent p-3 rounded-md" onClick={() => setPage(prev => prev + 1)}>Ver Mais Usuarios</button>
              </div> */}


            </div>

          )}

          {field === "pedidos" && requests.length > 0 ? (
            <div className="flex flex-col gap-3 overflow-auto no-scrollbar h-[68vh]">
              {requests.map((req) => (
                <CardRequest key={req.id_request} request={req} />
              ))}
            </div>
          ) : field === "pedidos" ? (
            <div className="bg-sidebar-accent p-5 h-[50vh] rounded-md border-2 border-dotted flex flex-col items-center justify-center gap-4">
              <SearchX className="w-12 h-12 text-gray-400" />
              <h1 className="text-[17px] text-sidebar-foreground/50 text-center">
                Você não possui nenhuma solicitação!
              </h1>
            </div>
          ) : null}



        </div>

      </header>

          </div>
    </section>

  )
}




function CardUserFriend({ commonUser }: { commonUser: CommonUser }) {

  const sendFriendRequest = async (id_user: string) => {
    const r = await UserApi.sendFriendRequest(id_user)
    if (r.code === 200) {
      toast.success("Pedido enviado com sucesso!")
      return
    }

    toast.error(r.message)
  }


  return (
    <div className="w-full p-5 rounded-md bg-sidebar-accent/30 ">

      <ToastContainer position="top-center" />

      <div className="flex gap-3 items-center">
        <div className="h-10 w-10 rounded-md overflow-hidden flex items-center justify-center bg-neutral-200">
          {commonUser?.profile_image ? (
            <img
              className="h-full w-full object-cover"
              src={commonUser.profile_image}
              alt=""
            />
          ) : (
            <User2 className="text-neutral-500" />
          )}
        </div>
        <div className="flex w-full flex-col leading-tight">
          <div className=" flex justify-between">

            <div className="flex items-center gap-2">
              <h1 className="font-semibold ">
                {commonUser.username}
              </h1>
              <h2 className="text-neutral-500">{commonUser.nickname}</h2>
            </div>



          </div>



        </div>

      </div>
      <div className="mt-5">
        <button className="p-2 rounded-md text-sm flex items-center gap-2 hover:bg-sidebar-accent/90 cursor-pointer" onClick={() => {
          if (!commonUser.id_user) return
          sendFriendRequest(commonUser.id_user)
        }}> <SendToBack /> Enviar solicitação</button>
      </div>
    </div>
  )
}


export function CardFriend({ friend }: { friend: CommonUser }) {

  const [chat, setChat] = useState<Chat | null>(null)

  const createOrGetChat = async (id_user: string) => {
    const chat = (await ChatAPi.createOrReturnChat(id_user)).data

    return chat

  }

  const getChat = async (id_user: string) => {
    const chat = (await ChatAPi.returnChat(id_user)).data
    setChat(chat ?? null)

  }

  useEffect(() => {
    getChat(friend.id_user!)
  }, [friend.id_user])

  return (
    <Card className="w-full -p-3 p-4  h-full rounded-md bg-sidebar-accent/30 relative">




      <ToastContainer position="top-center" />

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
          <div className="h-10 w-10 rounded-md overflow-hidden flex items-center justify-center bg-neutral-200">
            {friend.profile_image ? (
              <img
                className="h-full w-full object-cover"
                src={friend.profile_image}
                alt=""
              />
            ) : (
              <Avatar name={friend.username} />
            )}
          </div>
          <div className="flex w-full flex-col leading-tight">
            <div className=" flex justify-between">

              <div className="flex items-center gap-2">
                <h1 className="font-semibold ">
                  {friend.username}
                </h1>
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
              <Clock className="w-4"/>
              <h2 className="text-xs">Ultima mensagem enviada</h2>
            </div>
            <h1 className="text-md text-sidebar-foreground/60">{chat.messages[0].content ?? ""}</h1>
            <div className="text-sm text-sidebar-foreground/30">
              <h1 className="">
                enviada em {" "}
                {chat?.messages[0]
                  ? new Date(chat.messages[0].createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                  : "data desconhecida"}
              </h1>
            </div>
          </div>
        ) : null}


        <div className="flex gap-3">
          <Link onClick={async () => {
            await createOrGetChat(friend.id_user!)
          }}
            to={`/direct/${friend.id_user}`}
            className="pt-3 rounded-md text-sm flex items-center gap-2 hover:bg-sidebar-accent/90 cursor-pointer"
          >
            <MessageSquare /> Abrir Chat
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}





function CardRequest({ request }: { request: FriendRequest }) {


  const acceptRequest = async (id_request: string) => {
    const r = await UserApi.acceptFriendRequest(id_request)
    if (r.code === 200) {
      toast.success(r.message)
      return
    }

    toast.error(r.message)
  }

  return (
    <div className="w-full p-5 rounded-md bg-sidebar-accent/30 relative mt-5">

      <div className={`absolute text-background ${request.status === "accepted" ? "bg-green-400 " : request.status === "pending" ? "bg-orange-400" : "bg-red-400"} right-2 bottom-40 p-1 rounded-md`}>
        {request.status[0].toUpperCase() + request.status.slice(1)}
      </div>


      <ToastContainer position="top-center" />

      <div className="flex gap-3 items-center">
        <div className="h-10 w-10 rounded-md overflow-hidden flex items-center justify-center bg-neutral-200">
          {request.requester?.profile_image ? (
            <img
              className="h-full w-full object-cover"
              src={request.requester.profile_image}
              alt=""
            />
          ) : (
            <User2 className="text-neutral-500" />
          )}
        </div>
        <div className="flex w-full flex-col leading-tight">
          <div className=" flex justify-between">

            <div className="flex items-center gap-2">
              <h1 className="font-semibold ">
                {request.requester.username}
              </h1>
              <h2 className="text-neutral-500">{request.requester.nickname}</h2>
            </div>



          </div>



        </div>

      </div>
      <div className="flex items-center mt-4 gap-2 text-neutral-500 text-sm">
        <Calendar className="w-4 h-4" />
        <span>
          {new Date(request.createdAt!).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="mt-5 flex gap-3">
        <button className="p-2 rounded-md text-sm flex items-center gap-2 hover:bg-sidebar-accent/90 cursor-pointer" onClick={async () => {
          await acceptRequest(request.id_request)
        }}> <CheckCheck /> Aceitar </button>
        <button className="p-2 rounded-md text-sm flex items-center gap-2 hover:bg-sidebar-accent/90 cursor-pointer" onClick={() => {

        }}> <X /> Rejeitar </button>
      </div>
    </div>
  )
}

