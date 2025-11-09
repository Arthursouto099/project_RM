import type { Post } from "@/api/PostApi";
import PostApi from "@/api/PostApi";
import { useEffect, useRef, useState } from "react";
import Posts from "./post";
import ProfileDashboard from "./profile";
import { motion } from "framer-motion"



export default function ProfilePosts({ id_user }: { id_user: string }) {


    const [posts, setPosts] = useState<Post[]>([])
    const [page, setPage] = useState<number>(1)
    const [hasMore, setHasMore] = useState<boolean>(true)


    const postRef = useRef<HTMLDivElement>(null)

    useEffect(() => {

        const el = postRef.current
        if (!el) return

        const fetchPosts = async () => {
            const posts = (await PostApi.findPostsByMe(id_user, { page, limit: 10 })).data ?? []


            if (!posts || posts.length === 0) {
                setHasMore(false)
                return
            }


            setPosts((prev) => {
                const filtered = posts.filter(np => !prev.some(p => p.id_post === np.id_post))
                return [...prev, ...filtered]
            })



        }

        fetchPosts()

    }, [page, id_user])


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


    return (
        <div
            ref={postRef}
            className="flex flex-col  items-center  justify-start w-full min-h-screen m-5 overflow-y-auto no-scrollbar "
        >
            {/* Container central com limite de largura */}
            <div className="w-full  flex flex-col items-center gap-6 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full">
                    <ProfileDashboard id_user={id_user} />
                </motion.div>

                < motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full flex flex-col items-center gap-6">
                    {posts.map((post) => (
                        <Posts key={post.id_post} post={post}  />
                    ))}
                </motion.div>
            </div>
        </div>
    )






}