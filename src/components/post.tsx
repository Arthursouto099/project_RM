import type { Post } from "@/api/PostApi";
import { Calendar, User2 } from "lucide-react";
import { CarouselImgs } from "./carousel";
import { useEffect, useState } from "react";
import useAuth, { type Payload } from "@/hooks/useAuth";

export default function Posts({ post }: { post: Post }) {

  const [isUser, setUser] = useState<boolean>(false)
  const { payload } = useAuth()


  useEffect(() => {
    const checkUser = async (payload: Payload) => {

      if (!payload) return
      if (payload.id_user === post.user?.id_user) {
        setUser(true)
      }
    }

    checkUser(payload as Payload)
  }, [payload, post.user?.id_user])




  return (
    <div className="w-full">
      <div
        className="flex flex-col w-full  p-4 gap-3 border-b border-neutral-200 hover:bg-sidebar-foreground/20 hover:rounded-md transition-colors"
        key={post.id_post}
      >
        {/* Header */}
        <div className="flex gap-3 items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center bg-neutral-200">
            {post.user?.profile_image ? (
              <img
                className="h-full w-full object-cover"
                src={post.user.profile_image}
                alt=""
              />
            ) : (
              <User2 className="text-neutral-500" />
            )}
          </div>
          <div className="flex w-full flex-col leading-tight">
            <div className=" flex justify-between">

              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-sidebar-foreground">
                  {post.user?.username}
                </h1>
                <h2 className="text-neutral-500">{post.user?.nickname}</h2>
              </div>

              <div>
                {isUser ? (
                  <div className="flex gap-2 cursor-pointer"  >

                    <h1 className="text-3xl text-sidebar-foreground">...</h1>
                    
                  </div>
                ) : null}
              </div>

            </div>

          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-medium text-sidebar-foreground  break-words">
            {post.title}
          </h1>
          <p className="text-sidebar-accent-foreground text-sm break-words">{post.content}</p>

          {post.images && post.images.length > 0 && (
            <div className="w-full rounded-lg overflow-hidden border border-neutral-200">
              <CarouselImgs urls={post.images} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 text-neutral-500 text-sm">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(post.createdAt!).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>

      </div>
    </div>

  )
}