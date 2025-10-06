import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

import { useEffect, useRef, useState } from "react"
import PostApi, { type Post } from "@/api/PostApi"
import Posts from "@/components/post"








export default function Home() {
    const [page, setPage] = useState<number>(1)
    const [posts, setPosts] = useState<Post[]>([])
    const [hasMore, setHasMore] = useState<boolean>(true)
    const { isAuthenticated } = useAuth()


    const postRef = useRef<HTMLDivElement>(null)

    // cuidando da paginação dos post
    useEffect(() => {
        
        const el = postRef.current
        if (!el) return

        

        const fecthPosts = async () => {
            const getAllPosts = await PostApi.findPosts(page, 5)
            const newPosts = getAllPosts.data?.posts ?? []
           


            if(!newPosts || newPosts.length === 0 ) {
                setHasMore(false)
                return
            }


            setPosts((prev) => {
              
                 const filtered = newPosts.filter(np => !prev.some(p => p.id_post === np.id_post))
                 return [...prev, ...filtered]
            })


            
        
        }

        fecthPosts()


    }, [page])


    useEffect(() => {
        const el = postRef.current
        if(!el) return

        const handleScroll = () => {
             if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50 && hasMore) {
        setPage(prev => prev + 1)
      }
        }

        el.addEventListener("scroll", handleScroll)
        return () => el.removeEventListener("scroll", handleScroll)
    }, [hasMore])



    // useEffect(() => {

    //     const fecthPosts = async () => {
    //         const getAllPosts = await PostApi.findPosts(page, 5)
    //         setPosts(prev => {
    //             const newPosts = getAllPosts.data?.posts ?? []
    //             const filtered = newPosts.filter(np => !prev.some(p => p.id_post === np.id_post))
    //             return [...prev, ...filtered]
    //         })
    //     }


    //     fecthPosts()

    // }, [page])

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
                        <div ref={postRef} className="flex w-[65%] m-5 flex-col no-scrollbar  overflow-y-auto max-h-[85vh]">
                            {posts.map((post) => (
                                <Posts key={post.id_post} post={post} />
                            ))}
                        </div>

                        {/* Botão para carregar mais */}
                        <div className="flex justify-center m-5">


                            {hasMore && (
                                <div>
                                  <h1 className="text-sidebar-foreground/40">Arraste a tela para mais publicações</h1>
                                </div>
                            )}
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