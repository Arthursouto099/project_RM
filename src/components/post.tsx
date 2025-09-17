import type { Post } from "@/api/PostApi";
import { Calendar, User2 } from "lucide-react";
import { CarouselImgs } from "./carousel";

export default function Posts(post: Post) {



    return (
        <div className="w-full">
            <div
                className="flex flex-col  border-b border-gray-300  w-full md:w-full   p-3   gap-3"
                key={post.id_post}
              >
                <div className="flex gap-2 items-center">
                  <div className="h-9 w-9 rounded-md  flex items-center justify-center">
                    {post.user?.profile_image ? (
                      <img className="rounded-md" src={post.user.profile_image} alt="" />
                    ) : (
                      <User2 />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-semibold text-neutral-700">{post.user?.username}</h1>
                    <h2 className="font-semibold text-neutral-700 opacity-80" >{post.user?.nickname}</h2>
                  </div>

                </div>

                <div className="flex flex-col gap-6">

              

                <h1 className="text-xl md:text-20 break-words font-semibold text-neutral-600">
                  {post.title}
                </h1>
                <p className="text-neutral-500 font-normal break-words">{post.content}</p>

                 {post.images && post.images.length > 0 ? (
                  <div className="w-full">
                    <CarouselImgs urls={post.images}></CarouselImgs>
                  </div>
                ) : null}

                  </div>

               

                <div className="w-full m-2 mb-5 flex items-center gap-2">
                  <Calendar className="text-neutral-500 w-5" />
                  <h1 className="font-semibold text-neutral-500">
                    {new Date(post.createdAt!).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </h1>
                </div>
              </div>
        </div>
    )
}