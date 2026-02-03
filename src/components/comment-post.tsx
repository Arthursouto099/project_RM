import React, { useEffect, useMemo, useState } from "react";
import type { Comment } from "@/api/PostApi";
import { Calendar, Edit, MessageCircleIcon, ReplyAll, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import PostApi from "@/api/PostApi";
import Avatar from "@/api_avatar";
import useAuth from "@/hooks/useAuth";
import { io } from "socket.io-client";

type CommentsProps = {
  comments: Comment[];
  id_post: string;
  noShowReplies: boolean;
};

/**
 * REGRAS:
 * - "all" guarda TODOS os comentários do post (pais + replies de qualquer nível)
 * - UI: para cada pai, renderiza replies ACHATADAS (todos descendentes)
 * - "Respondendo a @X": usa parentCommentId para achar o usuário no Map
 */
export default function Comments({
  comments,
  id_post,
  noShowReplies,
}: CommentsProps) {
  const [all, setAll] = useState<Comment[]>(comments);

  useEffect(() => {
    setAll(comments);
  }, [comments]);

  // Map por id_comment para lookup rápido
  const byId = useMemo(() => {
    const m = new Map<string, Comment>();
    for (const c of all) if (c.id_comment) m.set(c.id_comment, c);
    return m;
  }, [all]);

  // Descobre o ROOT (comentário pai principal) de qualquer comentário
  const rootIdOf = useMemo(() => {
    const cache = new Map<string, string>();

    const findRoot = (id: string): string => {
      if (cache.has(id)) return cache.get(id)!;
      const cur = byId.get(id);
      if (!cur) return id;

      const parentId = cur.parentCommentId;
      if (!parentId || !byId.get(parentId)) {
        cache.set(id, id);
        return id;
      }
      const root = findRoot(parentId);
      cache.set(id, root);
      return root;
    };

    return findRoot;
  }, [byId]);

  // Roots = comentários sem parentCommentId
  const roots = useMemo(() => all.filter((c) => !c.parentCommentId), [all]);

  // Agrupa TODOS descendentes de cada root (achatado)
  const repliesByRoot = useMemo(() => {
    const g = new Map<string, Comment[]>();
    for (const c of all) {
      if (!c.id_comment) continue;
      if (!c.parentCommentId) continue;
      const root = rootIdOf(c.id_comment);
      if (!g.has(root)) g.set(root, []);
      g.get(root)!.push(c);
    }

    // ordena por data (mais antigo -> mais novo). Ajuste se preferir ao contrário.
    for (const [k, arr] of g.entries()) {
      arr.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return da - db;
      });
      g.set(k, arr);
    }

    return g;
  }, [all, rootIdOf]);

  const upsert = (c: Comment) => {
    setAll((prev) => {
      const idx = prev.findIndex((x) => x.id_comment === c.id_comment);
      if (idx === -1) return [c, ...prev];
      const copy = prev.slice();
      copy[idx] = c;
      return copy;
    });
  };

  const remove = (id_comment: string) => {
    setAll((prev) => prev.filter((c) => c.id_comment !== id_comment));
  };

  // Socket: trate reply como "comment" também (não filtre só pelo pai direto)
  useEffect(() => {
    const socket = io("http://localhost:3300");
    socket.emit("joinComments");

    const onCreated = (newComment: Comment) => {
      // garante que é do post

      const pid =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (newComment as any)?.post?.id_post ?? (newComment as any)?.id_post;
      if (pid && pid !== id_post) return;
      upsert(newComment);
    };

    const onUpdated = (updated: Comment) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pid = (updated as any)?.post?.id_post ?? (updated as any)?.id_post;
      if (pid && pid !== id_post) return;
      upsert(updated);
    };

    const onDeleted = (deleted: Comment) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pid = (deleted as any)?.post?.id_post ?? (deleted as any)?.id_post;
      if (pid && pid !== id_post) return;
      if (deleted.id_comment) remove(deleted.id_comment);
    };

    // Se seu backend emite replyCreated/replyUpdated/replyDeleted, escute também:
    socket.on("commentCreated", onCreated);
    socket.on("commentUpdated", onUpdated);
    socket.on("commentDeleted", onDeleted);

    socket.on("replyCreated", onCreated);
    socket.on("replyUpdated", onUpdated);
    socket.on("replyDeleted", onDeleted);

    return () => {
      socket.off("commentCreated", onCreated);
      socket.off("commentUpdated", onUpdated);
      socket.off("commentDeleted", onDeleted);

      socket.off("replyCreated", onCreated);
      socket.off("replyUpdated", onUpdated);
      socket.off("replyDeleted", onDeleted);

      socket.disconnect();
    };
  }, [id_post]);

  return (
    <div className="flex flex-col w-full gap-3 sm:gap-4">
      {roots.map((root) => (
        <CommentRootCard
          noShowReplies={noShowReplies}
          key={root.id_comment}
          comment={root}
          id_post={id_post}
          replies={repliesByRoot.get(root.id_comment!) ?? []}
          byId={byId}
          onUpsert={upsert}
          onRemove={remove}
        />
      ))}
    </div>
  );
}

function CommentRootCard({
  comment,
  id_post,
  replies,
  byId,
  onUpsert,
  onRemove,
  noShowReplies = false,
}: {
  comment: Comment;
  noShowReplies?: boolean;
  id_post: string;
  replies: Comment[];
  byId: Map<string, Comment>;
  onUpsert: (c: Comment) => void;
  onRemove: (id: string) => void;
}) {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex flex-col w-full max-w-full">
      {/* Card principal (pai) */}
      <div className="group relative flex w-full min-w-0 items-start gap-3 rounded-2xl border border-sidebar-border/60 bg-sidebar/40 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-sidebar-accent/10" />

        <div className="mt-0.5 shrink-0">
          <div className="rounded-full ring-1 ring-sidebar-border/60">
            <Avatar
              name={comment.user?.username}
              className="w-11 h-11"
              image={comment.user?.profile_image}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                <span className="truncate font-semibold text-sm text-sidebar-foreground">
                  {comment.user?.username ?? "Usuário"}
                </span>
                <span className="text-[11px] text-sidebar-foreground/50 truncate">
                  {comment.user?.nickname}
                </span>
              </div>
            </div>

            <span className="shrink-0 text-[11px] text-neutral-500 flex items-center gap-1 rounded-full bg-sidebar-accent/10 px-2 py-1">
              <Calendar className="w-3 h-3" />
              {new Date(comment.createdAt ?? "").toLocaleDateString("pt-BR")}
            </span>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-sidebar-accent-foreground break-words whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* Ações do pai */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ReplyModal
              id_post={id_post}
              parentCommentId={comment.id_comment}
              replyingToLabel={`@${
                comment.user?.nickname ?? comment.user?.username ?? "Usuário"
              }`}
              onUpsert={onUpsert}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full px-3 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/15 transition"
              >
                <MessageCircleIcon className="mr-1.5 h-3.5 w-3.5" />
                <span className="hidden sm:block">Responder</span>
                <span className="sm:hidden">Resp.</span>
              </Button>
            </ReplyModal>

            {comment.id_user === user?.id_user && (
              <ReplyModal
                id_post={id_post}
                id_comment={comment.id_comment}
                parentCommentId={comment.parentCommentId ?? undefined}
                replyingToLabel={undefined}
                initialValue={comment.content ?? ""}
                onUpsert={onUpsert}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-full px-3 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/15 transition"
                >
                  <Edit className="mr-1.5 h-3.5 w-3.5" />
                  <span className="hidden sm:block">Editar</span>
                  <span className="sm:hidden">Edit.</span>
                </Button>
              </ReplyModal>
            )}

            {comment.id_user === user?.id_user && (
              <ReplyModalDelete
                id_comment={comment.id_comment!}
                parentCommentId={comment.parentCommentId ?? undefined}
                onRemove={onRemove}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-full px-3 text-xs text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition"
                >
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  <span className="hidden sm:block">Deletar</span>
                  <span className="sm:hidden">Del.</span>
                </Button>
              </ReplyModalDelete>
            )}
          </div>

          {/* Replies achatadas */}
          {replies.length > 0 && (
            <div className="mt-4">
              {noShowReplies === false && (
                <button
                  onClick={() => {
                    if (noShowReplies && noShowReplies === true) return;
                    setShowReplies((s) => !s);
                  }}
                  className="text-xs font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground transition inline-flex items-center gap-2 rounded-full border border-sidebar-border/60 bg-sidebar/30 px-3 py-1.5"
                >
                  <span>
                    {showReplies
                      ? "Ocultar respostas"
                      : `Ver ${replies.length} respostas`}
                  </span>
                </button>
              )}

              {showReplies && (
                <div className="relative mt-3">
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-sidebar-border/60" />
                  <div className="flex flex-col gap-3 pl-6">
                    {replies.map((r) => (
                      <ReplyItem
                        key={r.id_comment}
                        comment={r}
                        id_post={id_post}
                        byId={byId}
                        onUpsert={onUpsert}
                        onRemove={onRemove}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReplyItem({
  comment,
  id_post,
  byId,
  onUpsert,
  onRemove,
}: {
  comment: Comment;
  id_post: string;
  byId: Map<string, Comment>;
  onUpsert: (c: Comment) => void;
  onRemove: (id: string) => void;
}) {
  const { user } = useAuth();

  // identifica "quem estou respondendo"
  const replyingTo = comment.parentCommentId
    ? byId.get(comment.parentCommentId)
    : null;
  const replyingToLabel =
    replyingTo?.user?.nickname ?? replyingTo?.user?.username ?? "Usuário";

  return (
    <div className="flex items-start gap-3 w-full min-w-0">
      <div className="shrink-0 mt-0.5">
        <div className="h-7 w-7 rounded-full ring-1 ring-sidebar-border/60 overflow-hidden">
          <Avatar
            className="w-full h-full"
            name={comment.user?.username}
            image={comment.user?.profile_image}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-sidebar-foreground truncate">
            {comment.user?.username ?? "Usuário"}
          </span>
          <span className="text-[10px] text-sidebar-foreground/50 truncate">
            {comment.user?.nickname}
          </span>
          <span className="text-[10px] text-neutral-500">
            {new Date(comment.createdAt ?? "").toLocaleDateString("pt-BR")}
          </span>
        </div>

        {/* chip "Resposta a @X" */}
        {comment.parentCommentId && (
          <div className="mt-1 inline-flex max-w-full items-center gap-2 rounded-full border border-sidebar-border/60 bg-sidebar-accent/10 px-2 py-0.5 text-[10px] text-sidebar-accent-foreground/70 overflow-hidden">
            <ReplyAll className="h-3 w-3 shrink-0" />
            <span className="truncate">Resposta a {replyingToLabel}</span>
          </div>
        )}

        <p className="mt-1 text-sm text-sidebar-accent-foreground break-words whitespace-pre-wrap">
          {comment.content}
        </p>

        <div className="mt-1 flex items-center gap-3">
          {/* responder a reply -> parentCommentId = reply.id_comment */}
          <ReplyModal
            id_post={id_post}
            parentCommentId={comment.id_comment}
            replyingToLabel={`${
              comment.user?.nickname ?? comment.user?.username ?? "Usuário"
            }`}
            onUpsert={onUpsert}
          >
            <button className="text-[11px] font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground">
              Responder
            </button>
          </ReplyModal>

          {comment.id_user === user?.id_user && (
            <ReplyModal
              id_post={id_post}
              id_comment={comment.id_comment}
              parentCommentId={comment.parentCommentId ?? undefined}
              initialValue={comment.content ?? ""}
              onUpsert={onUpsert}
            >
              <button className="text-[11px] font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground">
                Editar
              </button>
            </ReplyModal>
          )}

          {comment.id_user === user?.id_user && (
            <ReplyModalDelete
              id_comment={comment.id_comment!}
              parentCommentId={comment.parentCommentId ?? undefined}
              onRemove={onRemove}
            >
              <button className="text-[11px] font-medium text-red-400/70 hover:text-red-400">
                Excluir
              </button>
            </ReplyModalDelete>
          )}
        </div>
      </div>
    </div>
  );
}

export function ReplyModal({
  children,
  id_post,
  parentCommentId,
  id_comment,
  initialValue,
  replyingToLabel,
  onUpsert,
}: {
  children: React.ReactNode;
  id_post: string;
  parentCommentId?: string;
  id_comment?: string;
  initialValue?: string;
  replyingToLabel?: string;
  onUpsert: (c: Comment) => void;
}) {
  const [content, setContent] = useState(initialValue ?? "");

  useEffect(() => {
    setContent(initialValue ?? "");
  }, [initialValue]);

  const onSubmit = async () => {
    try {
      // otimista simples (opcional): cria placeholder local
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let response: any;
      if (id_comment) {
        response = await PostApi.updateComment({
          id_comment,
          content,
          parentCommentId,
        });
      } else {
        response = await PostApi.createComment({
          id_post,
          content,
          parentCommentId,
        });
      }

      toast.success(response.message);

      // se a API retornar o comentário criado/atualizado em response.data, use:
      if (response?.data?.id_comment) {
        onUpsert(response.data);
      } else {
        // fallback: você pode forçar um refetch do post fora daqui se quiser
      }

      setContent("");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-sidebar text-sidebar-foreground max-w-md rounded-2xl border border-sidebar-border/70 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <MessageCircleIcon className="h-5 w-5" />
            {id_comment ? "Editar Comentário" : "Responder Comentário"}
          </DialogTitle>
        </DialogHeader>

        {replyingToLabel && !id_comment && (
          <div className="text-xs text-sidebar-foreground/70">
            Respondendo a <span className="font-medium">{replyingToLabel}</span>
          </div>
        )}

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Digite sua resposta..."
          className="w-full resize-none mt-3 min-h-[110px] rounded-xl bg-sidebar/40 border-sidebar-border/70 focus-visible:ring-1 focus-visible:ring-sidebar-accent/40"
        />

        <div className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              onClick={onSubmit}
              disabled={!content.trim()}
              className="h-9 rounded-full px-4 bg-sidebar-accent hover:bg-sidebar-accent/80 disabled:opacity-50"
            >
              {id_comment ? "Salvar" : "Responder"}
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
  parentCommentId,
  onRemove,
}: {
  children: React.ReactNode;
  parentCommentId?: string;
  id_comment: string;
  onRemove: (id: string) => void;
}) {
  const onDelete = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let response: any;
      if (parentCommentId)
        response = await PostApi.deleteComment(id_comment, parentCommentId);
      else response = await PostApi.deleteComment(id_comment);

      toast.success(response.message);
      onRemove(id_comment);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-sidebar text-sidebar-foreground max-w-md rounded-2xl border border-sidebar-border/70 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <MessageCircleIcon className="h-5 w-5" />
            Excluir Comentário
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 text-sm text-sidebar-foreground/70">
          Tem certeza que deseja excluir este comentário? Esta ação não pode ser
          desfeita.
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <DialogClose asChild>
            <Button className="h-9 rounded-full px-4 bg-sidebar/40 hover:bg-sidebar/60 border border-sidebar-border/70">
              Cancelar
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              onClick={onDelete}
              className="h-9 rounded-full px-4 bg-red-500/90 hover:bg-red-500 text-white"
            >
              Excluir
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
