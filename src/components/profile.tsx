import type { CommonUser } from "@/api/UserApi"
import UserApi from "@/api/UserApi"
import { MessageSquare, Users2Icon } from "lucide-react"
import { useEffect, useState } from "react"

export default function ProfileDashboard({id_user}: {id_user: string}) {
    const [user, setUser] = useState<CommonUser | null>(null)
    



    useEffect(() => {

        const getUser = async () => {
            const user = (await UserApi.getUser(id_user)).data
            if(!user) return

            setUser(user)
        }


        getUser()


    }, [id_user])


    console.log(user)


    return (
        <div className="w-[100%] m-auto  h-full ">
            <div className="flex gap-5 w-full h-full">
                <div>
                    {user?.profile_image  ? (
                        <img className="rounded-full w-50  border-3"  src={user.profile_image} alt="" />
                    ): (
                    <div></div>
                    ) }


                </div>


                <div className="w-full">
                    <h1 className="text-sidebar-foreground text-460">{user?.username}</h1>

                    <div className="mt-5 flex gap-9 text-sidebar-foreground">
                        <div>
                            <div className="flex items-center gap-3 "><MessageSquare/> {user?.posts?.length}  </div>
                            <h1>Postagens</h1>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 ">< Users2Icon/> {user?.friends?.length}  </div>
                            <h1>Amizades</h1>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 "><MessageSquare/> {user?.posts?.length}  </div>
                            <h1>Postagens</h1>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    )
}