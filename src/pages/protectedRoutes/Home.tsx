import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

import { useEffect, useState } from "react"
import PostApi, { type Post } from "@/api/PostApi"
import Posts from "@/components/post"
import { PlusCircle } from "lucide-react"







export default function Home() {
    const [page, setPage] = useState<number>(1)
    const [posts, setPosts] = useState<Post[]>([])
    const {isAuthenticated } = useAuth()


    useEffect(() => {

        const fecthPosts = async () => {
            const getAllPosts = await PostApi.findPosts(page, 5)
            setPosts(prev => {
                const newPosts = getAllPosts.data?.posts ?? []
                const filtered = newPosts.filter(np => !prev.some(p => p.id_post === np.id_post))
                return [...prev, ...filtered]
            })
        }


        fecthPosts()

    }, [page])

    if (!isAuthenticated) {
        return <Navigate to={"/login"} replace state={{ from: location }} />
    }







    return (
      
            <section className="w-[90%] m-auto  flex justify-center text-sidebar-foreground items-start">
                <div className="w-full flex">

                    {/* Área principal de posts */}
                    <div className="flex-1/2 flex justify-center">
                        <div className="w-full flex flex-col">

                            {/* Div que será rolável */}
                            <div className="flex m-5 flex-col no-scrollbar overflow-y-auto max-h-[85vh]">
                                {posts.map((post) => (
                                    <Posts key={post.id_post} post={post}/>
                                ))}
                            </div>

                            {/* Botão para carregar mais */}
                            <div className="flex justify-center m-5">


                                <button
                                    className="p-2  cursor-pointer rounded-md flex items-center gap-2 bg-accent text-background 
                                     hover:bg-accent/80 hover:scale-105 transition-all duration-200"
                                    onClick={() => setPage(prev => prev + 1)}
                                >
                                    <PlusCircle />
                                    Mais publicações
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="flex-1/4 ml-5">
                      
                    </div>

                </div>
            </section>
       


    )
}