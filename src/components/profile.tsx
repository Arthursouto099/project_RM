import type { CommonUser } from "@/api/UserApi"
import UserApi from "@/api/UserApi"
import { MessageSquare, User, Users2Icon } from "lucide-react"
import { useEffect, useState } from "react"



export default function ProfileDashboard({ id_user }: { id_user: string }) {
  const [user, setUser] = useState<CommonUser | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const res = await UserApi.getUser(id_user)
      if (res?.data) setUser(res.data)
    }

    getUser()
  }, [id_user])

  return (
    <div className="w-full max-w-5xl m-auto p-5 h-full flex flex-col items-center">
     
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full bg-sidebar-accent/20 rounded-2xl shadow-md p-6 transition-all">
     
        <div className="flex-shrink-0 relative">
          {user?.profile_image ? (
            <img
              className="rounded-full w-36 h-36 object-cover border-4 border-sidebar-foreground/30 shadow-sm"
              src={user.profile_image}
              alt={user.username}
            />
          ) : (
            <div className="w-36 h-36 rounded-full border-4 border-sidebar-foreground/30 flex justify-center items-center bg-sidebar-accent/40 shadow-sm">
              <User className="w-16 h-16 text-sidebar-foreground" />
            </div>
          )}
        </div>


        <div className="flex flex-col flex-1 text-sidebar-foreground w-full">
          <h1 className="text-3xl font-semibold mb-2 break-all">{user?.username}</h1>

          <div className="flex flex-wrap gap-6 mt-2">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5" /> {user?.posts?.length ?? 0}
              </div>
              <span className="text-sm text-sidebar-foreground/70">Postagens</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-lg">
                <Users2Icon className="w-5 h-5" /> {user?.friends?.length ?? 0}
              </div>
              <span className="text-sm text-sidebar-foreground/70">Amizades</span>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {user?.nickname && (
              <h2 className="text-xl font-medium">{user.nickname}</h2>
            )}
            {user?.bio && (
              <p className="text-sm text-sidebar-foreground/80 leading-relaxed max-w-md">
                {user.bio}
              </p>
            )}
          </div>
        </div>
      </div>


      {user?.desc && (
        <div className="w-full mt-6 bg-sidebar-accent/20 rounded-2xl p-5 shadow-md text-sidebar-foreground">
          <p className="text-sm sm:text-base leading-relaxed">{user.desc}</p>
        </div>
      )}
    </div>
  )
}
