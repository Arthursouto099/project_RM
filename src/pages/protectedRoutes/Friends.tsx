import type { CommonUser, FriendRequest } from "@/api/UserApi";
import UserApi from "@/api/UserApi";
import useAuth, { type Payload } from "@/hooks/useAuth";
import Layout from "@/layout";
import { toast, ToastContainer } from "react-toastify"


import { Calendar, CheckCheck, FileQuestionIcon, Search, SearchX, SearchXIcon, SendToBack, User2, X, } from "lucide-react";
import { useEffect, useState } from "react";





export default function Friends() {
  const [field, setFields] = useState<"pedidos" | "usuarios" | "amigos">("usuarios")
  const [requests, setRequest] = useState<FriendRequest[]>([])
  const [friends, setFriends] = useState<CommonUser[]>([])
  const [page, setPage] = useState<number>(1)
  const [users, setUsers] = useState<CommonUser[]>([])
  const { payload } = useAuth()


  useEffect(() => {
    const getUsers = async () => {
      const request = await UserApi.getUsers(page, 5);
      setUsers(prev => {
        const users = request.data ?? []
        const fill = users.filter(np => !prev.some(u => u.id_user === np.id_user))
        return [...prev, ...fill]

      })
    }

    getUsers()
  }, [page])


  useEffect(() => {
    const getFriends = async () => {
      const request = await UserApi.getFriends(1, 10)
      setFriends(prev => {
        // por algum caralho eu precisei verificar se ele e mesmo um array
        const friendsL = Array.isArray(request.data) ? request.data : []
        const fill = friendsL.filter(np => !prev.some(u => u.id_user === np.id_user))
        return [...prev, ...fill]
      })
    }

    getFriends()
  }, [])

  

  useEffect(() => {
    const getRequest = async () => {
      const request = await UserApi.getFriendRequest()
      setRequest(request.data?.filter((d) => d.status === "pending") ?? [])
    }

    getRequest()
  })


  return (
    <Layout>
      <section className="m-5 h-[95%] flex  gap-5">
        <header className="w-full">

          <div className="w-full p-2 mt-1 mb-1 rounded-md bg-green-300 text-[18px] text-background font-normal shadow"> <h1 >Solicitações e Usuarios</h1></div>
          <div className="w-[100%] relative">

            


            <div className="flex gap-3 mt-4 mb-4">
              <h1 className={`border-t-0 cursor-pointer border-l-0 border-r-0 ${field && field === "pedidos" ? "border-b-accent border-2" : ""} `} onClick={() => setFields("pedidos")}>Pedidos</h1>
              <h1 className={`border-t-0 cursor-pointer border-l-0 border-r-0 ${field && field === "usuarios" ? "border-b-accent border-2" : ""} `} onClick={() => setFields("usuarios")} >Usuarios</h1>
            </div>

            <Search className="absolute  top-13 right-4" />
            <input className="w-full rounded-md border mb-5 p-2" placeholder="@usuario" type="text" name="" id="" />


            {field === "usuarios" && (
              <div className="flex flex-col gap-3 overflow-auto no-scrollbar h-[68vh]" >
                {users.filter((u) => u.id_user !== (payload as Payload).id_user).map((u) => (
                  <CardUserFriend key={u.id_user} commonUser={u} />
                ))}
        

              </div>
            )}

            {field === "pedidos" && requests.length > 0 ? (
              <div className="flex flex-col gap-3 overflow-auto no-scrollbar h-[68vh]">
                {requests.map((req) => (
                  <CardRequest key={req.id_request} request={req} />
                ))}
              </div>
            ) : field === "pedidos" ? (
              <div className="bg-background-dark/40 p-5 h-[50vh] rounded-md border-2 border-dotted flex flex-col items-center justify-center gap-4">
                <SearchX className="w-12 h-12 text-gray-400" />
                <h1 className="text-[17px] text-black/50 text-center">
                  Você não possui nenhuma solicitação!
                </h1>
              </div>
            ) : null}



          </div>

        </header>


        <div className="w-full  ">
          <div className="w-full p-2 mt-1 mb-1 rounded-md bg-green-300 text-[18px] text-background font-normal shadow"> <h1 >Solicitações e Usuarios</h1></div>
          <div className="mt-4 ">

            
            <div className="flex gap-3 mt-4 mb-4">

              <h1 className={`border-t-0 cursor-pointer border-l-0 border-r-0 border-b-accent border-2 `}>Amigos</h1>
              
            </div>

        
            <input className="w-full rounded-md border mb-5 p-2" placeholder="@usuario" type="text" name="" id="" />

             <div className="flex flex-col overflow-auto no-scrollbar h-[68vh] gap-3">
                {friends.map((u) => (
                  <CardFriend key={u.id_user} friend={u} />
                ))}
                

              </div>

          
          </div>
        </div>
      </section>
    </Layout>
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
    <div className="w-full p-5 rounded-md bg-background-dark/30 ">

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
              <h1 className="font-semibold text-neutral-900">
                {commonUser.username}
              </h1>
              <h2 className="text-neutral-500">{commonUser.nickname}</h2>
            </div>



          </div>



        </div>

      </div>
      <div className="mt-5">
        <button className="p-2 rounded-md text-sm flex items-center gap-2 hover:bg-background-dark cursor-pointer" onClick={() => {
          if (!commonUser.id_user) return
          sendFriendRequest(commonUser.id_user)
        }}> <SendToBack /> Enviar solicitação</button>
      </div>
    </div>
  )
}
function CardFriend({ friend }: { friend: CommonUser }) {


  const friendAction = async () => {

  }

  return (
    <div className="w-full p-5 rounded-md bg-background-dark/30 relative">




      <ToastContainer position="top-center" />

      <div className="flex gap-3 items-center">
        <div className="h-10 w-10 rounded-md overflow-hidden flex items-center justify-center bg-neutral-200">
          {friend.profile_image ? (
            <img
              className="h-full w-full object-cover"
              src={friend.profile_image}
              alt=""
            />
          ) : (
            <User2 className="text-neutral-500" />
          )}
        </div>
        <div className="flex w-full flex-col leading-tight">
          <div className=" flex justify-between">

            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-neutral-900">
                {friend.username}
              </h1>
              <h2 className="text-neutral-500">{friend.nickname}</h2>
            </div>



          </div>



        </div>

      </div>
      <div className="flex items-center mt-4 gap-2 text-neutral-500 text-sm">
        <Calendar className="w-4 h-4" />
        <span>


        </span>
      </div>

      <div className="mt-5 flex gap-3">
        <button className="p-2 rounded-md text-sm flex items-center gap-2 hover:bg-background-dark cursor-pointer" onClick={async () => {

        }}> <CheckCheck /> Aceitar </button>
        <button className="p-2 rounded-md text-sm flex items-center gap-2 hover:bg-background-dark cursor-pointer" onClick={() => {

        }}> <X /> Rejeitar </button>
      </div>
    </div>
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
    <div className="w-full p-5 rounded-md bg-background-dark/30 relative">

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
              <h1 className="font-semibold text-neutral-900">
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
        <button className="p-2 rounded-md text-sm flex items-center gap-2 hover:bg-background-dark cursor-pointer" onClick={async () => {
          await acceptRequest(request.id_request)
        }}> <CheckCheck /> Aceitar </button>
        <button className="p-2 rounded-md text-sm flex items-center gap-2 hover:bg-background-dark cursor-pointer" onClick={() => {

        }}> <X /> Rejeitar </button>
      </div>
    </div>
  )
}

