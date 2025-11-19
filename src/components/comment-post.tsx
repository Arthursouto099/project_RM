
import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Comment } from "@/api/PostApi";
import { Calendar, DeleteIcon, Edit, LucideReplyAll, MessageCircleIcon, ReplyAll, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import PostApi from "@/api/PostApi";
import Avatar from "@/api_avatar";
import useAuth from "@/hooks/useAuth";
import { io } from "socket.io-client";



type CommentsProps = {
  comments: Comment[];
  id_post: string;
};


type Pagination = {
  limit: number,
  page: number
}


type RepliesSelectorProps = {
  id_comment: string,
  setReplies: Dispatch<SetStateAction<Comment[]>>
  pagination: Pagination

}



const findRepliesByComment = async ({ id_comment, setReplies, pagination }: RepliesSelectorProps) => {
  const repliesByComment: Comment[] | undefined = (await PostApi.findReplies(pagination.page, pagination.limit, id_comment)).data


  setReplies(prev => {
    const newReplies = repliesByComment ?? [];
    const uniqueReplies = newReplies.filter(
      nr => !prev.some(pr => pr.id_comment === nr.id_comment)
    );
    return [...prev, ...uniqueReplies];
  });
}


export default function Comments({ comments, id_post }: CommentsProps) {




  // separo os comentarios que não possuiem parentCommentID
  const parentComments = comments.filter(comments => !comments.parentCommentId);



  return (
    <div className="flex flex-col gap-4 w-full">
      {parentComments.map((comment) => (
        <CommentItem key={comment.id_comment} comment={comment} id_post={id_post} />
      ))}
    </div>
  );
}

/* =======================
   Componente individual
======================= */
function CommentItem({ comment, id_post }: { comment: Comment; id_post: string }) {
  const { payload } = useAuth()
  const [page, setPage] = useState<number>(1)
  const [replies, setReplies] = useState<Comment[]>([])
  const [showReplies, setShowReplies] = useState(true);
  const [parentComment, setParentComment] = useState<Comment | null>(null)

  useEffect(() => {
    if (!comment.parentCommentId) return;

    const loadParentComment = async () => {
      try {
        if (!comment.parentCommentId) return
        const response = await PostApi.findComment(comment.parentCommentId)
        console.log(response)
        setParentComment(response.data ?? null)
      } catch (err) {
        console.error("Erro ao carregar comentário pai:", err)
      }
    }

    loadParentComment()
  }, [comment.parentCommentId])

  useEffect(() => {
    setReplies([])
    findRepliesByComment({ id_comment: comment.id_comment!, pagination: { page: page, limit: 20 }, setReplies })
  }, [comment.id_comment, id_post])


  useEffect(() => {
    const socket = io("http://localhost:3300")
    socket.emit("joinComments")



    socket.on("replyCreated", (newComment: Comment) => {


      if (newComment.parentCommentId === comment.id_comment) {
        setReplies((prev) => {
          if (prev.some((comment) => comment.id_comment === newComment.id_comment)) return prev
          return [newComment, ...prev]
        })
      }



    })


    socket.on("replyUpdated", (commentUpdated: Comment) => {
      setReplies((prev) =>
        prev.map((p) => (p.id_comment === commentUpdated.id_comment ? commentUpdated : p))
      )
    })


    socket.on("replyDeleted", (commentDeleted: Comment) => {
      setReplies((prev) =>
        prev.filter((p) => (p.id_comment !== commentDeleted.id_comment))
      )
    })



    return () => { socket.disconnect() }


  }, [])

  return (
    <div className="flex flex-col border-l-2 border-sidebar-border pl-3">

      <div className="flex items-start gap-3">
        <div className="h-full w-10 rounded-full text overflow-hidden bg-neutral-200 border border-sidebar-foreground/10 flex items-center justify-center">
          {comment.user?.profile_image ? (
            <img
              src={comment.user.profile_image}
              alt={comment.user.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <Avatar name={comment.user?.username ?? ""} />
          )}
        </div>

        <div className="flex flex-col w-full">
          <span className="font-medium mb-2 text-xs text-sidebar-foreground/50">
            {comment.user?.nickname}
          </span>
          <div className="flex justify-between">
            <span className="font-medium text-sm text-sidebar-foreground">
              {comment.user?.username ?? "Usuário"}
            </span>
            <span className="text-xs text-neutral-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(comment.createdAt ?? "").toLocaleDateString("pt-BR")}
            </span>
          </div>

          <p className="text-sm tex text-sidebar-accent-foreground mt-1 break-words">
            {comment.content}
          </p>


          {comment.parentCommentId && (

            <div className="text-[10px] md:text-xs mt-2 text-sidebar-accent-foreground/50 flex gap-2 items-center">
              <ReplyAll className="h-4 w-4" />
              <p>Resposta ao comentario de {parentComment?.user?.nickname ?? "rwoiherghui"}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-2">


            {(
              <ReplyModal id_post={id_post} parentCommentId={comment.id_comment}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground transition"
                >
                  <MessageCircleIcon className="w-2 h-2" />
                  <span className="hidden sm:block">Responder</span>
                </Button>
              </ReplyModal>
            )}




            {/* Editar (dono do comentário) */}
            {comment.id_user === payload?.id_user && (
              <ReplyModal
                id_post={id_post}
                parentCommentId={comment.parentCommentId ?? undefined}
                id_comment={comment.id_comment}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground transition"
                >
                  <Edit className="w-2 h-2" />
                  <span className="hidden sm:block">Editar</span>
                </Button>
              </ReplyModal>
            )}


            {comment.id_user === payload?.id_user && (
              <ReplyModalDelete id_comment={comment.id_comment!} parentCommentId={comment.parentCommentId ? comment.parentCommentId : undefined}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-sidebar-accent-foreground/70 gap-1 text-xs hover:bg-red-500/10 transition"
                >
                  <X className="w-2 h-2" />
                  <span className="hidden sm:block">Deletar</span>
                </Button>
              </ReplyModalDelete>
            )}

          </div>

          {/* Respostas */}
          {replies && replies.length > 0 && (
            <div className="mt-2  ml-4">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground "
              >
                {showReplies ? "Ocultar respostas" : `Ver ${replies.length} respostas`}
              </button>

              {showReplies && (
                <div className="mt-2 flex flex-col gap-2">
                  {replies.map((reply) => (
                    <CommentItem key={reply.id_comment} comment={reply} id_post={id_post} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function ReplyModal({
  children,
  id_post,
  parentCommentId,
  id_comment
}: {
  children: React.ReactNode;
  id_post: string;
  parentCommentId?: string | undefined;
  id_comment?: string
}) {
  const [content, setContent] = useState("");

  const onReply = async () => {
    try {

      let response;

      if (id_comment) {
        response = await PostApi.updateComment({ id_comment, content, parentCommentId })
      }
      else {
        response = await PostApi.createComment({
          id_post,
          content,
          parentCommentId,
        });
      }

      toast.success(response.message);
      setContent("");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-sidebar text-sidebar-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircleIcon /> {id_comment ? "Editar Comentario" : "Responder Comentario"}
          </DialogTitle>
        </DialogHeader>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite sua resposta..."
          className="w-full resize-none mt-3"
        />

        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button
              onClick={onReply}
              disabled={!content.trim()}
              className="bg-sidebar-accent  hover:bg-sidebar-accent/80"
            >
              {id_comment ? "Editar Comentario" : "Responder Comentario"}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function ReplyModalDelete({
  children,
  id_comment,
  parentCommentId
}: {
  children: React.ReactNode;
  parentCommentId?: string | undefined
  id_comment: string
}) {



  const onDelete = async () => {
    try {


      let response;

      if (parentCommentId) response = await PostApi.deleteComment(id_comment, parentCommentId)
      else response = await PostApi.deleteComment(id_comment)
      toast.success(response.message)

    } catch (e) {
      toast.error((e as Error).message)
    }
  };

  return (
    <Dialog >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-sidebar text-sidebar-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircleIcon /> Exluir Comentario
          </DialogTitle>
        </DialogHeader>


        {/* <div className="mt-4 flex justify-end">
          <Button
            onClick={onDelete}
            disabled={!content.trim()}
            className="bg-sidebar-accent  hover:bg-sidebar-accent/80"
          >
            Excluir Comentario
          </Button>
        </div> */}

        <div className="flex justify-center items-center">
          <div className="flex justify-center h-20 items-center gap-4">
            <DialogClose asChild>
              <Button className="bg-sidebar-accent hover:bg-sidebar-accent/80">
                Cancelar
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button
                onClick={onDelete}
                className="bg-sidebar-accent  hover:bg-sidebar-accent/80"
              >
                Excluir Comentario
              </Button>
            </DialogClose>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
