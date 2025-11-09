
import UserApi, { type CommonUser } from "@/api/UserApi";
import Avatar from "@/api_avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SendToBack, User2, Users2 } from "lucide-react"
import {  useEffect, useState } from "react";
import { toast } from "react-toastify";


export default function SuggestionFriends() {
    const [page, setPage] = useState<number>(1)
    const [users, setUsers] = useState<CommonUser[]>([])

    const sendFriendRequest = async (id_user: string) => {
        const r = await UserApi.sendFriendRequest(id_user)
        console.log(r)
        if (r.code === 200) {
            toast.success("Pedido enviado com sucesso!")
            return
        }

        toast.error(r.message)
    }

    useEffect(() => {
        const getUsers = async () => {
            const request = await UserApi.getUsers(page, 3);
            setUsers(prev => {
                const users = request.data ?? []
                const fill = users.filter(np => !prev.some(u => u.id_user === np.id_user))
                return [...prev, ...fill]

            })
        }

        getUsers()
    }, [page])

    return (
        <Card className=" h-[50%] ">
            <CardHeader>
                <CardTitle className=" flex gap-3   items-center"><Users2 /> Sugestões de amizade</CardTitle>
                <CardDescription>Connect com pessoas da sua região!</CardDescription>
            </CardHeader>
            <CardContent className="h-[50%] ">
                <div className="w-full flex flex-col gap-5 max-h-[100%] no-scrollbar overflow-y-auto">
                    {users.map((user) => (
                        <div className="" key={user.id_user}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                <div className="p-1 w-8 h-8  border border-gray-300 rounded-full">
                                    {user?.profile_image ? (
                                        <img
                                            className="h-full w-full object-cover"
                                            src={user.profile_image}
                                            alt=""
                                        />
                                    ) : (
                                        <Avatar name={user.username} />
                                    )}
                                </div>

                                <div className="flex flex-col ">
                                    <h1 className="text-sm">{user.username}</h1>
                                    <h3 className="text-sm text-sidebar-foreground/50">{user.nickname}</h3>
                                </div>
                                </div>


                                <div className="">
                                    <button className="p-2 text-sm rounded-md  flex items-center gap-2 hover:bg-sidebar-accent/90 cursor-pointer" onClick={() => {
                                        if (!user.id_user) return
                                        sendFriendRequest(user.id_user)
                                    }}> <SendToBack className="text-sm" /> </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
            <div>
              <h1 className=" border-b border-sidebar-accent pb-5 font-semibold text-2xl">Faça amigos e compartilhe suas experiencias!</h1>  
              
            </div>
              
            </CardFooter>
        </Card>
    )
}


