import PostApi, { type Post } from "@/api/PostApi";
import type { CommonUser } from "@/api/UserApi";
import UserApi from "@/api/UserApi";
import { CarouselImgs } from "@/components/carousel";
import Layout from "@/layout";
import { Calendar, Camera, User2, Users2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Profile() {
    const [myPosts, setPosts] = useState<Post[]>([])
    const [me, setMe] = useState<CommonUser>()

    useEffect(() => {
        const fecthMe = async () => {
            const res = await UserApi.get()

            if (!res) return

            setMe(res.data as CommonUser)
        }

        const fecthMePosts = async () => {
            const res = await PostApi.findPostsByMe()

            if (!res) return

            setPosts(res.data as Post[])
        }

        fecthMe()
        fecthMePosts()
    }, [])


    
    return (
       <Layout>
  <section className="m-5 h-[95%] w-full flex justify-center items-center">
    <div className="mt-20 w-full max-w-6xl flex flex-col gap-5 mx-auto">
      {/* Perfil */}
      <div className="flex justify-center flex-col md:flex-row gap-8 md:gap-20 items-center md:items-start text-center md:text-left">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-accent rounded-md flex items-center justify-center">
          {me?.profile_image ? (
            <img
              width={100}
              className="rounded-md w-full h-full bg-accent-dark border"
              src={me?.profile_image}
              alt=""
            />
          ) : (
            <User2 className="m-2 w-full h-full text-background" />
          )}
        </div>
        <div className="flex flex-col w-full max-w-2xl">
          <h1 className="text-2xl font-semibold">{me?.username}</h1>
          <div className="mt-2 h-[0.5px] w-full bg-accent"></div>
          <div className="flex gap-9 items-center justify-center md:justify-start">
            <div className="flex text-gray-600 mt-4 items-center gap-2">
              <Users2 />
              <p>{0}</p>
            </div>
            <div className="flex mt-4 text-gray-600 items-center gap-2">
              <Camera />
              <p>{myPosts.length}</p>
            </div>
          </div>
          <div className="mt-2">
            <h1 className="font-semibold">{me?.bio}</h1>
            <p className="text-sm break-words">{me?.desc}</p>
          </div>
        </div>
      </div>

      <div className="h-[0.5px] w-full bg-background-dark"></div>

      {/* Posts */}
      <div className="w-full flex flex-col gap-10 items-center">
        {myPosts.map((p) => (
          <div
            className="flex flex-col w-full md:w-[70%] p-3 bg-background-dark rounded-md gap-3"
            key={p.id_post}
          >
            <div className="flex gap-2 items-center">
              <div className="h-9 w-9 rounded-md bg-accent flex items-center justify-center">
                {me?.profile_image ? (
                  <img className="rounded-md" src={me.profile_image} alt="" />
                ) : (
                  <User2 />
                )}
              </div>
              <h1 className="font-semibold text-gray-700">{me?.username}</h1>
            </div>

            <h1 className="text-xl md:text-2xl break-words font-semibold text-gray-600">
              {p.title}
            </h1>
            <p className="text-gray-600 break-words">{p.content}</p>

            {p.images && p.images.length > 0 ? (
              <div className="w-full">
                <CarouselImgs urls={p.images}></CarouselImgs>
              </div>
            ) : null}

            <div className="w-full m-2 flex items-center gap-2">
                <Calendar className="text-gray-600"/>
              <h1 className="font-semibold text-gray-600">
                {new Date(p.createdAt!).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
</Layout>

    )
} 