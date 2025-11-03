import type { Post } from "@/api/PostApi";
import { Calendar, Delete, Edit, Heart, MessageCircleIcon, User2 } from "lucide-react";
import { CarouselImgs } from "./carousel";
import React, { useEffect, useState, type ReactNode } from "react";
import useAuth, { type Payload } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogCreatePost } from "./post-create-modal";
import DialogDeletePost from "./post-delete-model";
import { toast } from "react-toastify";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import PostApi from "@/api/PostApi";

export default function Posts({ post }: { post: Post }) {

  const [isUser, setUser] = useState<boolean>(false)
  const { payload } = useAuth()
  const [like, setLike] = useState<boolean>(false)

  useEffect(() => {
    const checkUser = async (payload: Payload) => {

      if (!payload) return
      if (payload.id_user === post.user?.id_user) {
        setUser(true)
      }
    }

    checkUser(payload as Payload)
  }, [payload, post.user?.id_user])




  return (
    <Card className="w-full flex-col flex   md:w-[90%]   md:p-0">
      <div
        className="flex flex-col w-full md:w-full   md:p-6 gap-3 hover:bg-sidebar-foreground/5 hover:rounded-md transition-colors"
        key={post.id_post}
      >
        {/* Header */}
        <CardHeader className="flex gap-3 items-center">

          <Link to={`/profiles/${post.user?.id_user}`}>
            <div className="h-13 w-13  border-2 cursor-pointer rounded-full overflow-x-hidden overflow-hidden flex items-center justify-center bg-neutral-200">
              {post.user?.profile_image ? (
                <img
                  className="h-full w-full object-cover"
                  src={post.user.profile_image}
                  alt=""
                />
              ) : (
                <User2 className="text-neutral-500" />
              )}
            </div>
          </Link>
          <div className="flex w-full flex-col leading-tight">
            <div className=" flex justify-between">

              <div className="flex items-center gap-2">
                <h1 className="font-semibold  text-sm max-w-30 md:max-w-full md:text-shadow-md text-sidebar-foreground">
                  {post.user?.username}
                </h1>
                <h2 className="text-neutral-500">{post.user?.nickname}</h2>
              </div>

              <div>
                {isUser ? (
                  <div className="flex gap-2 "  >

                    <PostOptions partialPost={{
                      id_post: post.id_post,
                      title: post.title,
                      content: post.content,
                      images: post.images

                    }}>
                      <h1 className="text-3xl cursor-pointer text-sidebar-foreground">...</h1>
                    </PostOptions>

                  </div>
                ) : null}
              </div>

            </div>

          </div>
        </CardHeader>


        <CardContent className="flex flex-col gap-3">
          <h1 className="text-lg font-medium text-sidebar-foreground  break-words">
            {post.title}
          </h1>
          <p className="text-sidebar-accent-foreground text-sm break-words">{post.content}</p>
          <div className="w-full flex">


            {post.images && post.images.length > 0 && (
              <div className="w-[100%] h-full rounded-lg overflow-hidden border border-neutral-200">
                <CarouselImgs urls={post.images} />
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-5">
          <div>
            <div className="flex  gap-2 ">
              <div className="flex items-center gap-3">
                <CreateCommentModal
                id_post={post.id_post!}>
                  <MessageCircleIcon className="cursor-pointer" />
                </CreateCommentModal>

              </div>
              <div className="flex items-center gap-3">
                <Heart onClick={() => setLike(prev => !prev)} className={`cursor-pointer ${like ? "fill-sidebar-foreground" : ""}`} />
              </div>
            </div>
          </div>


          <div className="flex items-center gap-2 text-sidebar-foreground/60 text-sm">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(post.createdAt!).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
        </CardFooter>



      </div>
    </Card>

  )
}


export function PostOptions({ children, partialPost }: { children: React.ReactNode; partialPost?: Partial<Post> }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>


      <DialogTrigger asChild>
        {children}
      </DialogTrigger>





      <DialogContent className="bg-sidebar text-sm text-sidebar-foreground flex-row gap-2">
        <DialogHeader />
        <DialogTitle />
        <DialogDescription />

        <DialogCreatePost
          onClose={handleClose}
          partialUpdatePost={{
            id_post: partialPost?.id_post,
            title: partialPost?.title,
            content: partialPost?.content,
            images: partialPost?.images
          }}
          isUpdated={true}
        >
          <div className="flex cursor-pointer gap-4">
            <Edit />
            <h1>Editar Post</h1>
          </div>
        </DialogCreatePost>

        <DialogDeletePost onDeleted={(e) => {
          return toast.success(e)
        }} onClose={handleClose} id_post={partialPost?.id_post ?? ""}>
          <div className="flex  cursor-pointer gap-4">
            <Delete />
            <h1>Deletar Post</h1>
          </div>
        </DialogDeletePost>

        <DialogFooter />

      </DialogContent>


    </Dialog>
  )
}



const CreateCommentModal = (props: { children: ReactNode, id_post: string }) => {
  const [content, setContent] = useState<string>("");

  const onComment =  async () => {
    try {
      const request = await PostApi.createComment({id_post: props.id_post, content: content })
      toast.success(request.message)
    }
    catch(e) {
      toast.error((e as any).message)
    }
  } 

  return (
    <Dialog>
      <DialogTrigger>{props.children}</DialogTrigger>
      <DialogContent className=" bg-sidebar max-w-[24rem] text-sidebar-foreground ">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircleIcon /> Criar Comentário
            </DialogTitle>
            <DialogDescription>
              Escreva seu comentário relacionado ao post
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5">
            <Textarea
            onChange={(e) => setContent(e.target.value)}
              className="w-full box-border  break-words break-all"
              placeholder="Escreva seu comentário..."
            />
          </div>

          <div className="mt-5">
            <Button onClick={onComment} className="bg-sidebar-accent hover:bg-sidebar-foreground/30">
              <h1>Comentar</h1>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}