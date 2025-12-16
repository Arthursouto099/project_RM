import type { Comment, Post } from "@/api/PostApi";
import {
  BadgeCheck,
  Calendar,
  Delete,
  Edit,
  Heart,
  MessageCircleIcon,
  MessageSquareWarning,
  MessagesSquareIcon,
  MoreHorizontal,
  SearchSlash,
} from "lucide-react";
import { CarouselImgs } from "./carousel";
import React, { useEffect, useState, type ReactNode } from "react";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import PostApi from "@/api/PostApi";
import Comments from "./comment-post";
import instanceV1 from "@/api/api@instance/ap-v1i";
import Avatar from "@/api_avatar";
import { io } from "socket.io-client";
import { tokenActions } from "@/@tokenSettings/token";

const findCommentsByIdPost = async (
  id_post: string,
  { page, limit }: { page: number; limit: number },
  set: React.Dispatch<React.SetStateAction<Comment[]>>,
  noParent?: string
) => {
  const parents = (
    await instanceV1.get(
      `/post/comment/${id_post}?page=${page}&limit=${limit}${
        noParent ? `&onlyParents=true` : ""
      }`
    )
  ).data.data as Comment[];

  // ✅ FLATTEN: pais + replies do include
  const flattened: Comment[] = [
    ...parents,
    ...parents.flatMap((p) => p.replies ?? []),
  ];

  set((prev) => {
    const filtered = flattened.filter(
      (np) => !prev.some((p) => p.id_comment === np.id_comment)
    );
    return [...prev, ...filtered].sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  });
};

export default function Posts({ post }: { post: Post }) {
  const [isUser, setUser] = useState(false);
  const { payload } = useAuth();
  const [page] = useState<number>(1);
  const [like, setLike] = useState(false);
  



  useEffect(() => {
    if (payload?.id_user === post.user?.id_user) setUser(true);
  }, [payload, post.user?.id_user]);

  return (
    <Card
      className="
        w-full flex flex-col
        bg-sidebar/60 backdrop-blur
        border border-sidebar-border
        shadow-sm
        hover:shadow-md
        hover:bg-sidebar/80
        transition-all duration-200
        text-sidebar-foreground
      "
    >
      <div className="flex flex-col w-full gap-3 p-4 md:p-6" key={post.id_post}>
        {/* Header */}
        <CardHeader className="flex gap-3 items-center p-0">
          <Link to={`/profiles/${post.user?.id_user}`} className="shrink-0">
            <Avatar
              name={post.user?.username}
              image={post.user?.profile_image}
            />
          </Link>

          <div className="flex w-full justify-between items-center gap-3">
            <div className="flex flex-col leading-tight min-w-0">
              <h1 className="font-semibold flex flex-col gap-1 text-sm items-center md:text-base text-sidebar-foreground truncate">
                <div className="flex gap-1 w-full items-center">
                  {post.user?.username}
                  {post.user?.verified && (
                    <BadgeCheck className="text-green-500" size={18} />
                  )}
                </div>

                <div className="flex w-full items-center gap-2 border-b border-border/40 pb-2">
                  {post.user?.accountType &&
                    post.user?.accountType !== "USER" && (
                      <span className="rounded-md bg-accent/20 px-2 py-0.5 text-[10px] font-medium uppercase text-accent-foreground/80">
                        {post.user.accountType}
                      </span>
                    )}

                  {post.user?.professionalType && (
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                      {post.user.professionalType}
                    </span>
                  )}
                </div>
              </h1>
              <h2 className="text-muted-foreground text-xs md:text-sm truncate">
                {post.user?.nickname}
              </h2>
            </div>

            <div>
              {isUser && (
                <PostOptions
                  partialPost={{
                    id_post: post.id_post,
                    title: post.title,
                    content: post.content,
                    images: post.images,
                  }}
                >
                  <button
                    type="button"
                    className="
                    rounded-full p-2
                    hover:bg-sidebar-accent/20
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-sidebar-accent
                    transition
                  "
                    aria-label="Opções do post"
                  >
                    <MoreHorizontal className="w-5 h-5 text-sidebar-foreground" />
                  </button>
                </PostOptions>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Conteúdo */}
        <CardContent className="flex flex-col gap-3 p-0">
          {post.title && (
            <h1 className="text-lg font-medium text-sidebar-foreground break-words">
              {post.title}
            </h1>
          )}

          {post.content && (
            <p className="text-sm md:text-base leading-relaxed text-sidebar-accent-foreground whitespace-pre-line break-words">
              {post.content}
            </p>
          )}

          {((post.images && post.images.length > 0) ||
            (post.videos && post.videos.length > 0)) && (
            <div
              className="
      w-full
      md:w-[70%]
      rounded-xl overflow-hidden
      border border-sidebar-border
      bg-black/5
      shadow-sm
    "
            >
              <CarouselImgs
                urls={[...(post.images ?? []), ...(post.videos ?? [])]}
              />
            </div>
          )}
        </CardContent>

        {/* Rodapé */}
        <CardFooter className="flex flex-col items-start gap-4 p-0 w-full">
          {/* Comentários */}

          {/* Ações */}
          <div className="w-full h-[0.5px] bg-accent/5 "/>

          <div className="flex w-full text-foreground/50  flex-col  md:flex-row items-center no-scrolbar gap-3">
          

            <AllCommentsData data={post} />

            <ReportModal id_post={post.id_post!} />

            <button
              type="button"
              onClick={() => setLike((prev) => !prev)}
              className={`
                flex items-center gap-2
                rounded-md px-3 py-2
                transition
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-sidebar-accent
                ${
                  like
                    ? "text-red-500 bg-red-500/10"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground"
                }
              `}
              aria-pressed={like}
              aria-label="Curtir"
            >
              <Heart
                className={`w-5 h-5 transition ${
                  like ? "fill-red-500 scale-110" : ""
                }`}
              />
              <span className="text-sm">Curtir</span>
            </button>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(post.createdAt!).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

interface AllCommentsDataProps {
  data: Post;
}

const fetchAllCommentsFlat = async (id_post: string) => {
  const [parentsRes] = await Promise.all([
    instanceV1.get(`/post/comment/${id_post}?page=1&limit=500`),
  ]);

  const parents = (parentsRes.data.data ?? []) as Comment[];

  return [...parents];
};

interface AllCommentsDataProps {
  data: Post;
}

export function AllCommentsData({ data }: AllCommentsDataProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [open, setOpen] = useState(false);

  // helpers (upsert/remove)
  const upsert = (c: Comment) => {
    setComments((prev) => {
      const idx = prev.findIndex((x) => x.id_comment === c.id_comment);
      if (idx === -1) return [c, ...prev];
      const copy = prev.slice();
      copy[idx] = { ...copy[idx], ...c };
      return copy;
    });
  };

  const remove = (id_comment: string) => {
    setComments((prev) => prev.filter((c) => c.id_comment !== id_comment));
  };

  // sempre que abrir o modal, faz um refetch (garante consistência)
  useEffect(() => {
    if (!open) return;

    let alive = true;
    (async () => {
      const all = await fetchAllCommentsFlat(data.id_post!);
      if (!alive) return;
      setComments(all);
    })();

    return () => {
      alive = false;
    };
  }, [open, data.id_post]);

  // tempo real via socket
  useEffect(() => {
    const socket = io("http://localhost:3300");
    socket.emit("joinComments");

    const samePost = (c: any) =>
      c?.id_post === data.id_post || c?.post?.id_post === data.id_post;

    const onCreated = (c: Comment) => {
      if (!samePost(c)) return;
      upsert(c);
    };

    const onUpdated = (c: Comment) => {
      if (!samePost(c)) return;
      upsert(c);
    };

    const onDeleted = (c: Comment) => {
      if (!samePost(c)) return;
      if (c.id_comment) remove(c.id_comment);
    };

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
  }, [data.id_post]);

  return (
    <div >
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span
        
          className=" cursor-pointer flex items-center gap-2 text-xs"
        >
          <MessagesSquareIcon />
          Ver Comentarios
        </span>
      </DialogTrigger>

      <DialogContent className="p-0  min-w-[50%] text-foreground">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex flex-col leading-tight">
            <h2 className="text-sm font-semibold text-foreground">
              Comentários
            </h2>
            <span className="text-xs text-muted-foreground">
              {comments.length} comentário{comments.length !== 1 && "s"}
            </span>
          </div>
        </div>

        {comments.length < 1 && (
          <div className="w-full flex-col flex text-center gap-4 items-center justify-center">
            <SearchSlash className="text-foreground/50" />

            <div>
              <h1>Ninguem chegou aqui ainda...</h1>
              <p className="text-sm text-center text-foreground/60 ">
                Espere alguem comentar, ou aproveite a solitude.
              </p>
            </div>
          </div>
        )}

        <div className="overflow-y-auto max-h-[calc(80vh-56px)] w-full scrollbar-custom px-4 py-3">
          <Comments
            noShowReplies={false}
            comments={comments}
            id_post={data.id_post!}
          />
        </div>
        
      <DialogFooter>
        <div className="w-full p-4">
            <CreateCommentModal id_post={data.id_post!}>
              <Button
                type="button"
                className="
                  flex items-center gap-2
                  bg-sidebar-accent
                  shadow-sm
                  hover:shadow
                  hover:bg-sidebar-accent/90
                  transition
                "
              >
                <MessageCircleIcon className="w-4 h-4" />
                Comentar
              </Button>
            </CreateCommentModal>
        </div>
        
      </DialogFooter>
      </DialogContent>

    </Dialog>
    </div>
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

      <DialogContent className="bg-sidebar text-sidebar-foreground text-sm shadow-lg border border-sidebar-border">
        <DialogHeader>
          <DialogTitle className="text-base">Opções do post</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Gerencie seu conteúdo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col g">
          <DialogCreatePost
            onClose={handleClose}
            partialUpdatePost={partialPost}
            isUpdated={true}
          >
            <div
              className="
                flex cursor-pointer items-center gap-3
                rounded-md px-3 py-2
                hover:bg-sidebar-accent/20
                transition-colors
              "
            >
              <Edit className="w-4 h-4" />
              <span>Editar Post</span>
            </div>
          </DialogCreatePost>

          <DialogDeletePost
            onDeleted={(msg) => toast.success(msg)}
            onClose={handleClose}
            id_post={partialPost?.id_post ?? ""}
          >
            <div
              className="
                flex cursor-pointer items-center gap-3
                rounded-md px-3 py-2
                hover:bg-red-500/10 hover:text-red-500
                transition-colors
              "
            >
              <Delete className="w-4 h-4" />
              <span>Deletar Post</span>
            </div>
          </DialogDeletePost>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}

interface ReportModalProps {
  id_post: string;
}

const ReportModal = ({ id_post }: ReportModalProps) => {
  const motivesList = [
    "Conteúdo ofensivo ou discurso de ódio",
    "Spam ou propaganda enganosa",
    "Informação falsa ou enganosa",
    "Assédio, bullying ou ameaça",
    "Conteúdo sexual impróprio",
    "Violência ou incentivo à violência",
    "Violação de direitos autorais",
    "Golpe ou tentativa de fraude",
  ];

  const [motive, setMotive] = useState<string | null>(null);

  const handleSend = async () => {
    const report = await instanceV1.post(
      `/post/report/${id_post}`,
      { motive },
      { headers: { Authorization: `bearer ${tokenActions.getToken()}` } }
    );
    toast.info("Report Enviado com sucesso");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
            <span
        
          className=" cursor-pointer flex items-center gap-2 text-xs"
        >
          <MessageSquareWarning/>
          Reportar
        </span>
      </DialogTrigger>
      <DialogContent className="text-foreground">
        <DialogHeader className="space-y-3 text-center">
          <DialogTitle className="flex items-center justify-center gap-2 text-base font-semibold">
            <MessageSquareWarning className="h-5 w-5 text-destructive" />
            Reportar postagem
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Selecione o motivo pelo qual você deseja denunciar esta mensagem.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-card p-3 rounded-xl">
          <ul className="space-y-3">
            {motivesList.map((item) => (
              <li
                key={item}
                onClick={() => setMotive(item)}
                className={`
        cursor-pointer pb-3 border-b border-b-accent/5
        text-sm
        transition-colors
        hover:text-accent
        ${motive === item ? "text-accent font-medium" : ""}
      `}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full">
          <DialogClose asChild>
            <Button
              variant={"outline"}
              onClick={async () => {
                await handleSend();
              }}
            >
              Proseguir
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-sidebar text-sidebar-foreground max-w-md shadow-lg border border-sidebar-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <MessageCircleIcon className="w-5 h-5" /> Criar Comentário
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Escreva seu comentário sobre o post.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva seu comentário..."
            className="
              w-full resize-none
              bg-sidebar/40
              border border-sidebar-border
              focus-visible:ring-2 focus-visible:ring-sidebar-accent
              transition
              min-h-[110px]
            "
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setContent("")}
            className="hover:bg-sidebar-accent/20"
          >
            Limpar
          </Button>

          <Button
            type="button"
            onClick={onComment}
            disabled={!content.trim()}
            className="
              flex items-center gap-2
              bg-sidebar-accent
              shadow-sm
              hover:shadow
              hover:bg-sidebar-accent/90
              transition
            "
          >
            <MessageCircleIcon className="w-4 h-4" />
            Comentar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
