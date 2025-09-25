import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import Layout from "@/layout"
import { useEffect, useState } from "react"
import PostApi, { type Post } from "@/api/PostApi"
import Posts from "@/components/post"







export default function Home() {
    const [page, setPage] = useState<number>(1)
    const [posts, setPosts] = useState<Post[]>([])
    const { payload, isAuthenticated } = useAuth()


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
        <Layout>
            <section className="w-[90%] m-auto flex justify-center items-start">
                <div className="w-full flex">

                    {/* Área principal de posts */}
                    <div className="flex-1/2 flex justify-center">
                        <div className="w-full flex flex-col">

                            {/* Div que será rolável */}
                            <div className="flex m-5 flex-col no-scrollbar overflow-y-auto max-h-[85vh]">
                                {posts.map((post) => (
                                    Posts(post)
                                ))}
                            </div>

                            {/* Botão para carregar mais */}
                            <div className="flex justify-center m-5">
                                <button
                                    className="p-3 rounded-md bg-accent text-background"
                                    onClick={() => setPage(prev => prev + 1)}
                                >
                                    Mais publicações
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="flex-1/4 ml-5">
                        <h1>wfiohreugref</h1>
                    </div>

                </div>
            </section>
        </Layout>


    )
}