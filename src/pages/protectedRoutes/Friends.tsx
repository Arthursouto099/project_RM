import type { CommonUser } from "@/api/UserApi";
import UserApi from "@/api/UserApi";
import useAuth, { type Payload } from "@/hooks/useAuth";
import Layout from "@/layout";

import { Search, SendToBack, User2 } from "lucide-react";
import {  useEffect, useState } from "react";





export default function Friends() {
    const [field, setFields] = useState<"pedidos" | "usuarios" >("usuarios")
    const [page, setPage] = useState<number>(1)
    const [users, setUsers] = useState<CommonUser[]>([])
    const {payload} = useAuth()


    useEffect(() => {
        const getUsers = async () => {
            const request = await UserApi.getUsers(page,10);
            setUsers(prev => {
                const users = request.data ?? []
                const fill = users.filter(np => !prev.some(u => u.id_user === np.id_user ))
                return [...prev, ...fill]

            } )
        }

        getUsers()
    }, [page])


    return (
        <Layout>
            <section className="m-5 h-[95%] ">
                <header className="w-full ">
                    <div className="w-[50%] relative">
                        <Search className="absolute  top-2 right-4" />
                        <input className="w-full rounded-md border p-2" placeholder="@usuario" type="text" name="" id="" />

                        <div className="flex gap-3 mt-4 mb-4">
                            <h1 className={`border-t-0 cursor-pointer border-l-0 border-r-0 ${field && field === "pedidos" ? "border-b-accent border-2" : ""} `} onClick={() => setFields("pedidos")}>Pedidos</h1>
                            <h1 className={`border-t-0 cursor-pointer border-l-0 border-r-0 ${field && field === "usuarios" ? "border-b-accent border-2" : ""} `} onClick={() => setFields("usuarios")} >Usuarios</h1>
                        </div>


                        {field === "usuarios" && (
                            <div className="flex flex-col gap-3">
                            {users.filter((u) => u.id_user !== (payload as Payload).id_user).map((u) => (
                                <CardUserFriend key={u.id_user} commonUser={u}/>
                            ))}
                            
                        </div>
                        )}
                        

                    </div>

                </header>
            </section>
        </Layout>
    )
}




function CardUserFriend({commonUser} : {commonUser: CommonUser}) {
    return (
        <div className="w-full p-5 rounded-md bg-background-dark/30 ">
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
                    
                }}> <SendToBack/> Enviar solicitação</button>
         </div>
        </div>
    )
}