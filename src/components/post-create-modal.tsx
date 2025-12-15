import PostApi, { type Post } from "@/api/PostApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/storage/supabaseClient";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { CarouselImgs } from "./carousel";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

export function DialogCreatePost({
  isUpdated = false,
  children,
  partialUpdatePost,
  onClose,
}: {
  children: React.ReactNode;
  isUpdated: boolean;
  partialUpdatePost?: Partial<Post>;
  onClose: () => void;
}) {
  const [preview, setPreview] = useState<string[]>(
    partialUpdatePost?.images ?? []
  );
  const [prevTitle, setPrevTitle] = useState<string>(
    partialUpdatePost?.title ?? ""
  );
  const [prevContent, setPrevContent] = useState<string>(
    partialUpdatePost?.content ?? ""
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="
          sm:max-w-6xl w-full
          h-[92vh]
          rounded-2xl
          border border-sidebar-border
          bg-sidebar/70 backdrop-blur
          p-0 overflow-hidden
          shadow-xl
          text-foreground 
        "
      >
        <DialogHeader
          className="
            px-6 py-4
            border-b border-sidebar-border
            bg-sidebar/60
          "
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="text-lg md:text-xl font-semibold truncate">
                {isUpdated ? "Editar Post" : "Criar Post"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Preencha o formulário e acompanhe a pré-visualização em tempo real.
              </DialogDescription>
            </div>

            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-3 py-1 rounded-full border border-sidebar-border bg-sidebar/60">
                Visualização
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full h-full px-6 py-6 overflow-hidden">
          {/* Form */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto pr-1 no-scrollbar">
            <div
              className="
                rounded-2xl
                border border-sidebar-border
                bg-sidebar/50
                shadow-sm
                p-5 md:p-6
              "
            >
              <CreatePostForm
                onPreviewsChange={(e) => setPreview(e)}
                onContentChange={(c) => setPrevContent(c)}
                onTitleChange={(t) => setPrevTitle(t)}
                isUpdated={isUpdated}
                isUpdatePost={partialUpdatePost}
                onClose={() => onClose()}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto pr-1 no-scrollbar">
            <div
              className="
                rounded-2xl
                border border-sidebar-border
                bg-sidebar/50
                shadow-sm
                p-5 md:p-6
                flex flex-col gap-4
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base md:text-lg  font-semibold">
                    Pré-visualização
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Assim sua publicação vai aparecer no feed.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="break-words text-xl md:text-2xl font-bold leading-tight">
                  {prevTitle.length < 1 ? "Título do post" : prevTitle}
                </h1>

                <p className="break-words text-sm md:text-base leading-relaxed text-sidebar-accent-foreground whitespace-pre-line">
                  {prevContent.length < 1
                    ? "Conteúdo do post"
                    : prevContent}
                </p>
              </div>

              <div
                className="
                  rounded-xl overflow-hidden
                  border border-sidebar-border
                  bg-black/5
                  shadow-sm
                "
              >
                {preview.length > 0 ? (
                  <CarouselImgs urls={preview} />
                ) : (
                  <div
                    className="
                      w-full
                      aspect-[4/3] sm:aspect-video
                      flex flex-col items-center justify-center
                      gap-2
                      text-sm text-muted-foreground
                    "
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span>Sem mídia selecionada</span>
                  </div>
                )}
              </div>

              <div className="mt-1 text-xs text-muted-foreground">
                Dica: use imagens em boa resolução e vídeos curtos.
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-sidebar-border bg-sidebar/60">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="
                rounded-xl
                hover:bg-sidebar-accent/20
                transition
              "
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CreatePostProps {
  onPreviewsChange?: (previews: string[]) => void;
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
  onClose?: () => void;
  isUpdated?: boolean;
  isUpdatePost?: Partial<Post>;
}

/** Overlay de loading (padrão shadcn/shadow UI) */
export function Loading({ onOpen }: { onOpen: boolean }) {
  if (!onOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-5 py-4 shadow-xl">
        <Loader2 className="h-5 w-5 animate-spin text-white" />
        <span className="text-sm text-white/90">Enviando...</span>
      </div>
    </div>
  );
}

export function CreatePostForm({
  onPreviewsChange,
  onTitleChange,
  onContentChange,
  isUpdated = false,
  isUpdatePost,
  onClose,
}: CreatePostProps) {
  const [title, setTitle] = useState<string>( isUpdatePost?.title ?? "");
  const [content, setContent] = useState<string>( isUpdatePost?.content ?? "");
  const [files, setFiles] = useState<File[] | null>();
  const [, setImageUrls] = useState<string[]>([]);
  const [isFileUpdated, setFileUpdated] = useState<boolean>(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // contador e limites (UI)
  const titleCount = title.length;
  const contentCount = content.length;
  const titleMax = 190;
  const contentMax = 390;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    if (onPreviewsChange) onPreviewsChange(urls);
  }

  const removePreviewAt = (idx: number) => {
    setPreviews((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (onPreviewsChange) onPreviewsChange(next);
      return next;
    });

    setFiles((prev) => {
      if (!prev) return prev;
      return prev.filter((_, i) => i !== idx);
    });

    setFileUpdated(true);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      setLoading(true);

      if (isFileUpdated && files && files.length > 0) {
        const urls: string[] = [];

        await Promise.all(
          files.map(async (file) => {
            const fileExt = file.type.split("/")[1] || "mp4";
            const fileName = `${Date.now()}-${Math.random()
              .toString(36)
              .substring(7)}.${fileExt}`;

            const { error } = await supabase.storage
              .from("images")
              .upload(fileName, file, { upsert: true });

            if (error) {
              console.error("Erro no upload:", error);
              return;
            }

            const { data } = supabase.storage.from("images").getPublicUrl(fileName);
            if (data?.publicUrl) urls.push(data.publicUrl);
          })
        );

        setImageUrls(urls);

        if (!isUpdated) {
          const res = await PostApi.create({ title, content, images: urls });
          if (!res.success) return toast.error(res.message);
          toast.success(res.message);
          return;
        }

        const res = await PostApi.update({
          title,
          content,
          images: urls,
          id_post: isUpdatePost?.id_post,
        });
        if (!res.success) return toast.error(res.message);
        toast.success(res.message);
        return;
      }

      // Caso não haja arquivos novos
      if (!isUpdated) {
        const res = await PostApi.create({ title, content });
        if (!res.success) return toast.error(res.message);
        toast.success(res.message);
        return;
      }

      const res = await PostApi.update({
        title,
        content,
        id_post: isUpdatePost?.id_post,
      });
      if (!res.success) return toast.error(res.message);
      toast.success(res.message);
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      if (onClose) onClose();
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Loading onOpen={loading} />
      <ToastContainer position="top-center" />

      <div className="space-y-4">
        {/* Título */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <label className="font-semibold text-sm">Título</label>
            <span
              className={`text-xs ${
                titleCount > titleMax ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              {titleCount}/{titleMax}
            </span>
          </div>

          <input
            type="text"
            maxLength={titleMax}
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (onTitleChange) onTitleChange(e.target.value);
            }}
            placeholder="Digite o título da publicação"
            className="
              w-full
              rounded-xl
              border border-sidebar-border
              bg-sidebar/40
              px-3 py-2
              text-sm
              shadow-sm
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-sidebar-accent
              transition
            "
          />
        </div>

        {/* Conteúdo */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <label className="font-semibold text-sm">Conteúdo</label>
            <span
              className={`text-xs ${
                contentCount > contentMax ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              {contentCount}/{contentMax}
            </span>
          </div>

          <textarea
            placeholder="Escreva algo relacionado ao seu post"
            maxLength={contentMax}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (onContentChange) onContentChange(e.target.value);
            }}
            className="
              w-full min-h-28
              rounded-xl
              border border-sidebar-border
              bg-sidebar/40
              px-3 py-2
              text-sm
              resize-none
              shadow-sm
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-sidebar-accent
              transition
            "
          />
        </div>

        {/* Upload */}
        <div className="space-y-2">
          <label className="font-semibold text-sm">Mídia</label>

          <div
            className="
              flex flex-col gap-3
              rounded-xl
              border border-dashed border-sidebar-border
              bg-sidebar/30
              p-4
            "
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Selecione imagens ou vídeos (múltiplos arquivos).
              </div>

              <label
                className="
                  inline-flex items-center gap-2
                  rounded-xl
                  bg-sidebar-accent
                  px-4 py-2
                  text-sm font-medium
                  text-sidebar-foreground
                  shadow-sm
                  hover:opacity-90
                  cursor-pointer
                  transition
                "
              >
                <Upload className="h-4 w-4" />
                Escolher arquivos
                <input
                  multiple
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    setFileUpdated(true);
                    handleFileChange(e);
                    const fileList = e.target.files;
                    const values: File[] = [];
                    if (fileList) for (const f of fileList) values.push(f);
                    setFiles(values);
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preview grid */}
            {previews.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {previews.map((src, idx) => {
                  const isVideo = /\.(mp4|webm|mov|avi|mkv)$/i.test(src);

                  return (
                    <div
                      key={idx}
                      className="
                        group relative
                        w-full aspect-square
                        overflow-hidden rounded-xl
                        border border-sidebar-border
                        bg-black/5
                        shadow-sm
                        hover:shadow-md
                        transition
                      "
                    >
                      {/* Remover */}
                      <button
                        type="button"
                        onClick={() => removePreviewAt(idx)}
                        className="
                          absolute right-2 top-2 z-10
                          rounded-full
                          bg-black/60
                          p-1.5
                          text-white
                          opacity-0 group-hover:opacity-100
                          transition
                          focus-visible:outline-none
                          focus-visible:ring-2 focus-visible:ring-white/60
                        "
                        aria-label="Remover mídia"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      {isVideo ? (
                        <video
                          src={src}
                          controls
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <img
                          src={src}
                          alt={`preview-${idx}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Nenhum arquivo selecionado.
              </div>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="submit"
            className="
              rounded-xl
              bg-sidebar-accent
              shadow-sm
              hover:shadow
              hover:opacity-90
              transition
            "
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </span>
            ) : (
              "Concluir"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
