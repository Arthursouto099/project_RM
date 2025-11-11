
import React, { useState } from "react";
import type { Comment } from "@/api/PostApi";
import { Calendar, LucideReplyAll, MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import PostApi from "@/api/PostApi";
import Avatar from "@/api_avatar";


type CommentsProps = {
  comments: Comment[];
  id_post: string;
};




export default function Comments({ comments, id_post }: CommentsProps) {


  


  if (!comments?.length) {
    return <p className="text-neutral-500    text-sm">Nenhum comentário ainda.</p>;
  }

  const parentComments = comments.filter(c => !c.parentCommentId);

  if (!parentComments.length) {
    return <p className="text-neutral-500 text-sm">Nenhum comentário ainda.</p>;
  }


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
  const [showReplies, setShowReplies] = useState(false);

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
           <Avatar name={comment.user?.username ?? ""}/>
          )}
        </div>

        <div className="flex flex-col w-full">
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

          {/* Botão de responder */}
          <div className="mt-2">
            {comment.parentCommentId ? (
              <div>
                <div className="flex gap-2 items-center text-sidebar-foreground/30">
                  <h1 className="text-xs">Resposta ao comentario</h1>
                  <LucideReplyAll className="w-4 h-4" />
                </div>
              </div>
            ) : (
              <ReplyModal id_post={id_post} parentCommentId={comment.id_comment!}>
                <Button variant="ghost" size="sm" className="text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground">
                  <MessageCircleIcon className="w-3 h-3 mr-1" />
                  Responder
                </Button>
              </ReplyModal>
            )}

          </div>

          {/* Respostas */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2  ml-4">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground "
              >
                {showReplies ? "Ocultar respostas" : `Ver ${comment.replies.length} respostas`}
              </button>

              {showReplies && (
                <div className="mt-2 flex flex-col gap-2">
                  {comment.replies.map((reply) => (
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

/* =======================
   Modal para responder
======================= */
function ReplyModal({
  children,
  id_post,
  parentCommentId,
}: {
  children: React.ReactNode;
  id_post: string;
  parentCommentId: string;
}) {
  const [content, setContent] = useState("");

  const onReply = async () => {
    try {
      const response = await PostApi.createComment({
        id_post,
        content,
        parentCommentId,
      });
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
            <MessageCircleIcon /> Responder Comentário
          </DialogTitle>
        </DialogHeader>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite sua resposta..."
          className="w-full resize-none mt-3"
        />

        <div className="mt-4 flex justify-end">
          <Button
            onClick={onReply}
            disabled={!content.trim()}
            className="bg-sidebar-accent  hover:bg-sidebar-accent/80"
          >
            Responder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
