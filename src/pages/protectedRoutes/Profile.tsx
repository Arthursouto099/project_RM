import PostApi, { type Post } from "@/api/PostApi";
import type { CommonUser } from "@/api/UserApi";
import UserApi from "@/api/UserApi";
import Layout from "@/layout";
import { Camera, User2, Users2 } from "lucide-react";
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


    console.log(myPosts)
    return (
        <Layout>
            <section className="m-5  h-[95%] w-[81vw] flex justify-center ">
                <div className="min-w-5xl justify-start mt-20   flex flex-col  gap-20 ">
                    <div className="flex gap-20">


                        <div className="w-40 h-40 bg-accent rounded-md flex items-center">
                            {me?.profile_image ? (<img width={100} className="rounded-md w-full h-full  bg-accent-dark border-1" src={me?.profile_image} alt="" />) : < User2 className=" m-2 w-full h-full text-background" />}
                        </div>
                        <div >
                            <div><h1 className="text-2xl font-semibold">{me?.username}</h1></div>
                            <div className=" mt-2  h-[0.5px] w-full bg-accent"></div>
                            <div className="flex gap-9 items-center">
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
                                <p className="text-sm break-words max-w-2xl">{me?.desc}</p>
                            </div>
                        </div>
                    </div>
                        <div className="h-[0.5px] w-full bg-background-dark"></div>
                        <div className=" w-full flex flex-col gap-15  ">
                            {myPosts.map((p) => (
                                <div className="flex flex-col p-3  gap-3" key={p.id_post}>
                                    <div className="flex gap-2 place-items-end-safe">
                                    <div className="h-9 w-9 rounded-md bg-accent" ></div>
                                    <div className="flex justify-between"><h1 className="font-semibold">{me?.username}</h1> </div>    
                                    </div>    

                                    <div>
                                        <h1 className="text-2xl break-words max-w-4xl font-semibold text-gray-600" >{p.title}</h1>
                                    </div>
                                    <div>
                                        <p className=" text-gray-600 break-words max-w-4xl" >{p.content}</p>
                                    </div>


                                    <div className="w-full "><h1>{new Date(p.createdAt!).toLocaleString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric"
                                    })}</h1></div>
                                </div>
                            ))}
                        </div>
                </div>

            </section>
        </Layout>
    )
} 