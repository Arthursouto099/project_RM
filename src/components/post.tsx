import type { Comment, Post } from "@/api/PostApi";
import {
  Calendar,
  ChevronDown,
  Delete,
  Edit,
  Heart,
  MessageCircleIcon,
} from "lucide-react";
import { CarouselImgs } from "./carousel";
import React, { useEffect, useState, type ReactNode } from "react";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogCreatePost } from "./post-create-modal";
import DialogDeletePost from "./post-delete-model";
import { toast } from "react-toastify";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import PostApi from "@/api/PostApi";
import Comments from "./comment-post";
import instanceV1 from "@/api/api@instance/ap-v1i";
import Avatar from "@/api_avatar";
import { io } from "socket.io-client";

const findCommentsByIdPost = async (id_post: string, { page, limit }: { page: number, limit: number }, set: React.Dispatch<React.SetStateAction<Comment[]>>) => {
  const comments = (await instanceV1.get(`/post/comment/${id_post}?page=${page}&limit=${limit}`)).data.data as Comment[]
  set((prev) => {
    const filtered = comments.filter(
      (np) => !prev.some((p) => p.id_comment === np.id_comment)
    )
    return [...prev, ...filtered]
  })

}

export default function Posts({ post }: { post: Post, }) {
  const [isUser, setUser] = useState(false);
  const { payload } = useAuth();
  const [page, setPage] = useState<number>(1)
  const [like, setLike] = useState(false);
  const [comments, setComments] = useState<Comment[]>([])


  useEffect(() => {
    findCommentsByIdPost(post.id_post!, { page, limit: 5 }, setComments)
  }, [post.id_post, page])

  useEffect(() => {
    const socket = io("http://localhost:3300")
    socket.emit("joinComments")

    socket.on("commentCreated", (newComment: Comment) => {
      setComments((prev) => {
        if(prev.some((comment) => comment.id_comment === newComment.id_comment)) return prev
        return [newComment, ...prev]
      })
    })

    return () => {
      socket.disconnect()
    }

  }, [])


  useEffect(() => {
    if (payload?.id_user === post.user?.id_user) {
      setUser(true);
    }
  }, [payload, post.user?.id_user]);

  return (
    <Card className="w-full text-sidebar-foreground md:w-[90%] flex flex-col border border-sidebar-border bg-sidebar/50 backdrop-blur-sm transition-colors hover:bg-sidebar/70">
      <div className="flex flex-col w-full gap-3 p-4 md:p-6" key={post.id_post}>
        {/* Header */}
        <CardHeader className="flex gap-3 items-center p-0">
          <Link to={`/profiles/${post.user?.id_user}`}>
            <div className="h-12 w-12 border border-sidebar-foreground/20 rounded-full overflow-hidden flex items-center justify-center bg-neutral-200">
              {post.user?.profile_image ? (
                <img
                  className="h-full w-full object-cover"
                  src={post.user.profile_image}
                  alt="Foto de perfil"
                />
              ) : (
                <Avatar name={post.user?.username ?? ""} />
              )}
            </div>
          </Link>

          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col leading-tight">
              <h1 className="font-semibold text-sm md:text-base text-sidebar-foreground truncate">
                {post.user?.username}
              </h1>
              <h2 className="text-neutral-500 text-xs md:text-sm">
                {post.user?.nickname}
              </h2>
            </div>

            {isUser && (
              <PostOptions
                partialPost={{
                  id_post: post.id_post,
                  title: post.title,
                  content: post.content,
                  images: post.images,
                }}
              >
                <h1 className="text-3xl cursor-pointer text-sidebar-foreground">
                  ...
                </h1>
              </PostOptions>
            )}
          </div>
        </CardHeader>


        <CardContent className="flex flex-col gap-3 p-0">
          {post.title && (
            <h1 className="text-lg font-medium text-sidebar-foreground break-words">
              {post.title}
            </h1>
          )}
          {post.content && (
            <p className="text-sidebar-accent-foreground text-sm break-words">
              {post.content}
            </p>
          )}

          {post.images && post.images.length > 0 && (
            <div className="w-full md:w-[70%] rounded-lg overflow-hidden border border-neutral-800">
              <CarouselImgs urls={post.images} />
            </div>
          )}
        </CardContent>

        {/* Rodapé */}
        <CardFooter className="flex flex-col items-start gap-4 p-0">
          <div className="mt-5">


            <Comments
              comments={
                comments
              }
              id_post={post.id_post!}
            />
          </div>

          {comments ? (
            <div onClick={() => {
              setPage(prev => prev + 1)
            }} className="flex items-center gap-1">
              <ChevronDown />
              <h1 className="text-sm">Ver mais comentarios</h1>
            </div>
          ) : (
            <div></div>
          )}

          <div className="flex gap-4 items-center">
            <CreateCommentModal id_post={post.id_post!}>
              <MessageCircleIcon className="cursor-pointer hover:text-sidebar-foreground/70 transition-colors" />
            </CreateCommentModal>

            <Heart
              onClick={() => setLike((prev) => !prev)}
              className={`cursor-pointer transition-colors ${like ? "fill-sidebar-foreground" : ""
                }`}
            />
          </div>

          <div className="flex items-center gap-2 text-sidebar-foreground/60 text-sm">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(post.createdAt!).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

/* =======================
   Opções de Post
======================= */
export function PostOptions({
  children,
  partialPost,
}: {
  children: React.ReactNode;
  partialPost?: Partial<Post>;
}) {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-sidebar text-sidebar-foreground text-sm">
        <DialogHeader />
        <DialogTitle />
        <DialogDescription />

        <DialogCreatePost
          onClose={handleClose}
          partialUpdatePost={partialPost}
          isUpdated={true}
        >
          <div className="flex cursor-pointer items-center gap-3 hover:text-sidebar-accent transition-colors">
            <Edit className="w-4 h-4" />
            <span>Editar Post</span>
          </div>
        </DialogCreatePost>

        <DialogDeletePost
          onDeleted={(msg) => toast.success(msg)}
          onClose={handleClose}
          id_post={partialPost?.id_post ?? ""}
        >
          <div className="flex cursor-pointer   items-center gap-3 hover:text-red-500 transition-colors">
            <Delete className="w-4 h-4" />
            <span>Deletar Post</span>
          </div>
        </DialogDeletePost>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}


const CreateCommentModal = ({
  children,
  id_post,
}: {
  children: ReactNode;
  id_post: string;
}) => {
  const [content, setContent] = useState("");

  const onComment = async () => {
    try {
      const response = await PostApi.createComment({
        id_post,
        content,
      });
      toast.success(response.message);
      setContent("");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="bg-sidebar text-sidebar-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircleIcon /> Criar Comentário
          </DialogTitle>
          <DialogDescription>
            Escreva seu comentário sobre o post.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva seu comentário..."
            className="w-full resize-none"
          />
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            onClick={onComment}
            disabled={!content.trim()}
            className="bg-sidebar-accent hover:bg-sidebar-accent/80"
          >
            Comentar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
