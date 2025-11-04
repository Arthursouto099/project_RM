import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useEffect, useRef, useState } from "react"
import PostApi, { type Post } from "@/api/PostApi"
import Posts from "@/components/post"

import { io } from "socket.io-client"
import SuggestionFriends from "@/components/suggestion-friends"
import SuggestionChats from "@/components/suggestion-chats"

export default function Home() {
  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState<Post[]>([])
  const [hasMore, setHasMore] = useState(true)
  const { isAuthenticated } = useAuth()
  const postRef = useRef<HTMLDivElement>(null)

  // 🔄 Paginação e busca de posts
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await PostApi.findPosts(page, 5)
      const newPosts = response.data?.posts ?? []

      if (!newPosts.length) {
        setHasMore(false)
        return
      }

      setPosts((prev) => {
        const filtered = newPosts.filter(
          (np) => !prev.some((p) => p.id_post === np.id_post)
        )
        return [...prev, ...filtered]
      })
    }

    fetchPosts()
  }, [page])

  // 🧭 Scroll infinito
  useEffect(() => {
    const el = postRef.current
    if (!el) return

    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50 && hasMore) {
        setPage((prev) => prev + 1)
      }
    }

    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [hasMore])

  // ⚡ Socket.IO para tempo real
  useEffect(() => {
    const socket = io("http://localhost:3300")
    socket.emit("joinPosts")

    socket.on("postCreated", (post: Post) => {
      setPosts((prev) => {
        if (prev.some((p) => p.id_post === post.id_post)) return prev
        return [post, ...prev]
      })
    })

    socket.on("postUpdated", (updatedPost: Post) => {
      setPosts((prev) =>
        prev.map((p) => (p.id_post === updatedPost.id_post ? updatedPost : p))
      )
    })

    socket.on("postDeleted", (deleted: Post) => {
      setPosts((prev) => prev.filter((p) => p.id_post !== deleted.id_post))
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // 🧠 Layout principal
  return (
    <section className="w-full h-screen ">
        <div className="flex w-full h-full gap-5 p-5">

            <div className="text-sidebar-foreground w-96 flex flex-col gap-5">
                <SuggestionFriends/>

                <SuggestionChats/>
             
            </div>

            <div ref={postRef} className="w-2xl gap-5 flex flex-col h-full overflow-y-auto no-scrollbar ">
                    {posts.map(post => (<Posts key={post.id_post} post={post}/>))}
            </div>



        </div>
    </section>
  )
}
