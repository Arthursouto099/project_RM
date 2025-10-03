import type { CommonUser } from "@/api/UserApi";
import UserApi from "@/api/UserApi";
import { useEffect, useState } from "react";
import { CardFriend } from "./Friends";
import { Search } from "lucide-react";




export function Direct() {

    const [friends, setFriends] = useState<CommonUser[]>([])
    const [page, setPage] = useState<number>(1)



    useEffect(() => {
        const getFriends = async () => {
            const request = await UserApi.getFriends(page, 10)
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
            <section className="m-5 h-[95%] flex flex-col text-sidebar-foreground  gap-5">
                <header className="w-full">
                    <div className="w-full p-4 mt-2  mb-2 rounded-xl bg-sidebar-accent shadow-md flex items-center justify-between">
                        <h1 className="text-sidebar-foreground text-xl font-semibold tracking-wide">
                            Chats
                        </h1>
                    </div>

                    <Search className="absolute  top-26 right-7" />
                    <input className="w-full rounded-md border mb-5 p-2" placeholder="@usuario" type="text" name="" id="" />

                </header>

                <div className="w-full flex flex-col gap-4">

                    {friends.map((f) => (
                        <CardFriend  key= {f.id_user} friend={f} />


                    ))}


                </div>


            </section>
      
    )


}  