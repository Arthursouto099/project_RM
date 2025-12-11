import type { CommonUser } from "@/api/UserApi";
import UserApi from "@/api/UserApi";
import { useEffect, useState } from "react";
import { CardFriend } from "./Friends";

import { Card, CardContent, CardHeader } from "@/components/ui/card";




export function Direct() {

    const [friends, setFriends] = useState<CommonUser[]>([])
    const [page, setPage] = useState<number>(1)
    const [fill, setFill] = useState<string>("")


    const filter = fill && fill !== "" ? friends.filter(f => f.username.toUpperCase().includes(fill.toUpperCase())) : friends




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
            <Card className="m-5 p-5 w-full h-[95%] flex flex-col text-sidebar-foreground  gap-5">
                <CardHeader className="w-full">
                   
                    <input className="w-full rounded-md border mb-5 p-2" placeholder="@usuario" onChange={(e) =>
                        setFill(e.target.value)
                    } type="text" name="" id="" />

                </CardHeader>

                <CardContent className="w-full overflow-y-auto no-scrollbar flex flex-col gap-4">

                    {filter.map((f) => (
                        <CardFriend  key= {f.id_user} friend={f} />
                    ))}


                </CardContent>


            </Card>
      
    )


}  