import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

import { useEffect, useRef, useState } from "react"
import PostApi, { type Post } from "@/api/PostApi"
import Posts from "@/components/post"
import { motion } from "framer-motion"
import { io, type Socket } from "socket.io-client"







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



            if (!newPosts || newPosts.length === 0) {
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
        if (!el) return

        const handleScroll = () => {
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50 && hasMore) {
                setPage(prev => prev + 1)
            }
        }

        el.addEventListener("scroll", handleScroll)
        return () => el.removeEventListener("scroll", handleScroll)
    }, [hasMore])



    useEffect(() => {
        const socketInstance = io("http://localhost:3300");

        socketInstance.emit("joinPosts");


        // toda vez que um emit de post é lançado
        socketInstance.on("postCreated", (post: Post) => {
            setPosts((prev) => {
                if (prev.some((p) => p.id_post === post.id_post)) return prev;
                return [post, ...prev];
            });
        });

        // toda vez que um emit de update é lançado
        socketInstance.on("postUpdated", (updatedPost: Post) => {
            setPosts((prev) => {
                return prev.map((post) =>
                    post.id_post === updatedPost.id_post ? updatedPost : post
                );
            });
        });

        // toda vez que um post é deletado
        socketInstance.on("postDeleted", (postDeleted: Post) => {
            setPosts((prev) => 
            prev.filter(post => post.id_post !== postDeleted.id_post)
            );
        });


        return () => {
            socketInstance.off("postCreated");
            socketInstance.off("postUpdated");
            socketInstance.off("postDeleted")
            socketInstance.disconnect();
        };
    }, [])



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

        <section className="w-screen overflow-x-hidden  md:w-full  flex justify-center items-start text-sidebar-foreground">
            <div className="w-[100%]  md:w-[90%] flex justify-center">



                {/* Área principal de posts */}
                <div className="flex flex-col items-center w-full max-w-4xl">
                    <div className="w-full mt-4 mb-5 md:w-[70%] ">
                        <div className="ml-8 md:ml-0">
                            <h1 className="font-semibold    text-2xl">PROJECT<span className="text-accent">RM</span></h1>
                        </div>
                        <div className="w-screen md:w-[87.5%] h-[1.1px]  bg-gray-200/20 mt-5 "></div>
                    </div>


                    {/* Div rolável */}
                    <motion.div
                        ref={postRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full md:w-[70%] pb-40 md:pb-0  flex flex-col overflow-y-auto no-scrollbar max-h-[100vh] md:max-h-[80vh] m-5"
                    >
                        {posts.map((post) => (
                            <Posts key={post.id_post} post={post} />
                        ))}
                    </motion.div>

                    {/* Mensagem de rolagem */}
                    {hasMore && (
                        <div className="flex justify-center m-5">
                            <h1 className="text-sidebar-foreground/40 text-center">
                                Arraste a tela para mais publicações
                            </h1>
                        </div>
                    )}
                </div>

            </div>
        </section>




    )
}