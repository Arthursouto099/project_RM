import {  User2, MessagesSquare, MessagesSquareIcon, StarsIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import type { CommonUser } from "@/api/UserApi"
import { useEffect, useState } from "react"
import UserApi from "@/api/UserApi"
import Avatar from "@/api_avatar"



export default function SuggestionChats() {
    const [friends, setFriends] = useState<CommonUser[]>([])
    const [page, setPage] = useState<number>(1)



    useEffect(() => {
        const getFriends = async () => {
            const request = await UserApi.getFriends(page, )
            setFriends(prev => {
                // por algum caralho eu precisei verificar se ele e mesmo um array
                const friendsL = Array.isArray(request.data) ? request.data : []
                const fill = friendsL.filter(np => !prev.some(u => u.id_user === np.id_user))
                return [...prev, ...fill]
            })
        }

        getFriends()
    }, [page])

    return (
        <Card className="h-[50%]">
            <CardHeader>
                <CardTitle className=" flex gap-3 text-2xl items-center"><MessagesSquareIcon/> Converse com seus amigos</CardTitle>
                <CardDescription>Inicie chats privados com seus amigos para compartilhas suas historias!</CardDescription>
            </CardHeader>
            <CardContent className="h-[50%] ">
                <div className="w-full flex flex-col gap-5 max-h-[100%] no-scrollbar overflow-y-auto">
                    {friends.map((user) => (
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
                                            <Avatar name={user.username}/>
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
                                        
                                    }}> <MessagesSquare className="text-sm" /> </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <div className="w-full">
                    <h1 className=" flex  items-center gap-2 border-b border-sidebar-accent pb-5 font-semibold text-2xl">
                        <StarsIcon/>
                        Dica 
                    </h1>
                    <p className="mt-4">Entre em comunidades ou debata assuntos em nossas pautas e grupos</p>

                </div>

            </CardFooter>
        </Card>
    )
    
}