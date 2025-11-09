import type { CommonUser } from "@/api/UserApi"
import UserApi from "@/api/UserApi"
import { MessageSquare, User, Users2Icon, Edit3, Info } from "lucide-react"
import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import Avatar from "@/api_avatar"

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
    <div className="w-full max-w-5xl mx-auto p-5 h-full flex flex-col items-center gap-6">
      <Card className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full bg-sidebar-accent/20 rounded-2xl shadow-md p-6 transition-all">
        <div className="flex-shrink-0 relative">
          {user?.profile_image ? (
            <img
              className="rounded-full w-36 h-36 object-cover border-4 border-sidebar-foreground/30 shadow-sm"
              src={user.profile_image}
              alt={user.username}
            />
          ) : (
            <div className="w-36 h-36 rounded-full border-4 border-sidebar-foreground/30 flex justify-center items-center bg-sidebar-accent/40 shadow-sm">
              <Avatar name={user?.username ?? "" }/>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 text-sidebar-foreground w-full gap-3">
          <h1 className="text-3xl font-semibold break-all">{user?.username}</h1>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-sidebar-accent" /> {user?.posts?.length ?? 0} postagens
            </div>
            <div className="flex items-center gap-2 text-lg">
              <Users2Icon className="w-5 h-5 text-sidebar-accent" /> {user?.friends?.length ?? 0} amizades
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {user?.nickname && (
              <div className="flex items-center gap-2 text-xl font-medium">
                <Edit3 className="w-5 h-5 text-sidebar-accent" /> {user.nickname}
              </div>
            )}
            {user?.bio && (
              <div className="flex items-start gap-2 text-sm text-sidebar-foreground/80 max-w-md">
                <Info className="w-4 h-4 mt-1 text-sidebar-accent" />
                <p>{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {user?.desc && (
        <Card className="w-full bg-sidebar-accent/20 rounded-2xl p-5 shadow-md text-sidebar-foreground flex items-start gap-2">
          <Info className="w-5 h-5 mt-1 text-sidebar-accent" />
          <p className="text-sm sm:text-base leading-relaxed">{user.desc}</p>
        </Card>
      )}
    </div>
  )
}
