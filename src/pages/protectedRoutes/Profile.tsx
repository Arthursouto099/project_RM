import PostApi, { type Post } from "@/api/PostApi";
import type { CommonUser } from "@/api/UserApi";
import UserApi from "@/api/UserApi";
import Posts from "@/components/post";
import Layout from "@/layout";
import { Camera, NotebookPenIcon, User2, Users2 } from "lucide-react";
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
      <section className="m-5 h-[95%] w-[90%] flex justify-center items-center">
        <div className="mt-20 w-full   flex  justify-center  items-center flex-col gap-5 mx-auto">
          {/* Perfil */}
          <div className="flex justify-center m-auto flex-col md:flex-row gap-8 md:gap-20 items-center md:items-start text-center md:text-left">
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
            <div className="flex flex-col w-full min-w-3xl max-w-3xl">
              <div>
                <h1 className="text-2xl font-semibold">{me?.username}</h1>
                <h2 className="opacity-80">{me?.nickname}</h2>
              </div>

              <div className="mt-2 h-[0.5px] w-full bg-accent"></div>
              <div className="flex gap-9 items-center justify-center md:justify-start">
                <div className="flex text-gray-600 mt-4 items-center gap-2">
                  <Users2 />
                  <p>{0}</p>
                </div>
                <div className="flex mt-4 text-gray-600 items-center gap-2">
                  <NotebookPenIcon />
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
          <div className="w-[50vw] min-h-[560px] flex flex-col gap-10 mt-10  justify-center items-center">
            {myPosts.map((p) => (
              <Posts key={p.id_post}post={p}/>
            ))}
             
          </div>
        </div>
      </section>
    </Layout>

  )
} 