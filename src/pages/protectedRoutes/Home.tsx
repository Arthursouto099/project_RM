import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useEffect, useRef, useState } from "react"
import PostApi, { type Post } from "@/api/PostApi"
import Posts from "@/components/post"

import { io } from "socket.io-client"
import SuggestionFriends from "@/components/suggestion-friends"
import SuggestionChats from "@/components/suggestion-chats"
// import SuggestionChats from "@/components/suggestion-chats"
// import SuggestionFriends from "@/components/suggestion-friends"


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


  useEffect(() => {
    const socket = io("http://localhost:3300")
    socket.emit("joinPosts")

    socket.on("postCreated", (newPost: Post) => {
      setPosts((prev) => {
        if (prev.some((p) => p.id_post === newPost.id_post)) return prev
        return [newPost, ...prev]
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
    <section className="w-full  overflow-y-auto">
      <div className="flex flex-col md:flex-row w-full h-full gap-5 p-5 overflow-auto">
        {/* Feed de posts */}
        <div
          ref={postRef}
          className="md:w-full   gap-5 flex flex-col  md:overflow-y-auto no-scrollbar"
        >
          {posts.map((post) => (
            <Posts key={post.id_post} post={post} />
          ))}
        </div>  

        <div className=" flex-1/2 text-sidebar-foreground flex flex-col gap-2">
          <SuggestionFriends/>
          <SuggestionChats/>
        </div>



      </div>
    </section>

  )
}
