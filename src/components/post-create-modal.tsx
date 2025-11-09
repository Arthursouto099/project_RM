import PostApi, { type Post } from "@/api/PostApi"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/storage/supabaseClient"
import React, { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { CarouselImgs } from "./carousel"
import { DialogDescription } from "@radix-ui/react-dialog"

export function DialogCreatePost({
  isUpdated = false,
  children,
  partialUpdatePost,
  onClose
}: {
  children: React.ReactNode
  isUpdated: boolean
  partialUpdatePost?: Partial<Post>
  onClose: () => void
}) {
  const [preview, setPreview] = useState<string[]>(partialUpdatePost?.images ?? [])
  const [prevTitle, setPrevTitle] = useState<string>(partialUpdatePost?.title ?? "")
  const [prevContent, setPrevContent] = useState<string>(partialUpdatePost?.content ?? "")

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-5xl w-full h-[90%] rounded-2xl shadow-2xl border border-gray-200/20 text-sidebar-foreground bg-sidebar p-0 overflow-hidden">
        <DialogHeader className="border-b border-gray-200/20 bg-side px-6 py-4">
          <DialogTitle className="flex justify-between items-center">
            <span className="text-xl font-semibold">
              {isUpdated ? "Editar Post" : "Criar Post"}
            </span>
            <span className=" mr-4 text-sm md:text-base font-medium">
              Visualizar Publicação
            </span>
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full p-6 overflow-y-auto no-scrollbar">
          {/* Lado do Formulário */}
          <div className="flex flex-1 items-start">
            <div className="w-full">
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

          {/* Lado da Visualização */}
          <div className="flex flex-col  md:overflow-auto flex-1 gap-4 md:gap-6 p-6 rounded-2xl border border-gray-200/20 shadow-sm ">
            <h1 className="break-words text-2xl md:text-3xl font-bold">
              {prevTitle.length < 1 ? "Pré-visualização da postagem" : prevTitle}
            </h1>

            <p className="break-words  no-scrollbar max-h-[25vh]  leading-relaxed">
              {prevContent.length < 1
                ? "Pré-visualização do conteúdo do post"
                : prevContent}
            </p>

            <div className="w-full rounded-lg overflow-hidden border border-gray-300/20">
              {preview.length > 0 ? (
                <CarouselImgs urls={preview} />
              ) : (
                <div className="w-full h-40 flex items-center justify-center border-2 border-dashed border-gray-300/20  rounded-lg">
                  Sem imagens
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-200/20 ">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="px-4 py-2 rounded-lg  hover:bg-gray-200 transition-colors duration-200"
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface CreatePostProps {
  onPreviewsChange?: (previews: string[]) => void
  onTitleChange?: (title: string) => void
  onContentChange?: (content: string) => void
  onClose?: () => void
  isUpdated?: boolean
  isUpdatePost?: Partial<Post>
}

export function CreatePostForm({
  onPreviewsChange,
  onTitleChange,
  onContentChange,
  isUpdated = false,
  isUpdatePost,
  onClose
}: CreatePostProps) {
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [files, setFiles] = useState<File[] | null>()
  const [, setImageUrls] = useState<string[]>([])
  const [isFileUpdated, setFileUpdated] = useState<boolean>(false)
  const [previews, setPreviews] = useState<string[]>([])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return

    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)

    const urls = selectedFiles.map((file) => URL.createObjectURL(file))
    setPreviews(urls)
    if (onPreviewsChange) onPreviewsChange(urls)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // --- lógica mantida exatamente igual ---
    if (isFileUpdated && files) {
      const urls: string[] = []
      await Promise.all(
        Array.from(files).map(async (file) => {
          const fileExt = file.name.split(".").pop()
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(7)}.${fileExt}`

          const { error } = await supabase.storage
            .from("images")
            .upload(fileName, file, { upsert: true })

          if (error) {
            console.error("Erro no upload:", error.message)
            return
          }

          const { data } = supabase.storage.from("images").getPublicUrl(fileName)
          if (data?.publicUrl) urls.push(data.publicUrl)
        })
      )

      setImageUrls(urls)

      if (!isUpdated) {
        const res = await PostApi.create({ title, content, images: urls })
        if (!res.success) return toast.error(res.message)
        toast.success(res.message)
        return
      }

      const res = await PostApi.update({
        title,
        content,
        images: urls,
        id_post: isUpdatePost?.id_post,
      })
      if (!res.success) return toast.error(res.message)
      toast.success(res.message)
      return
    }

    if (!isUpdated) {
      const res = await PostApi.create({ title, content })
      if (!res.success) return toast.error(res.message)
      toast.success(res.message)
      return
    }

    const res = await PostApi.update({
      title,
      content,
      id_post: isUpdatePost?.id_post,
    })
    if (!res.success) return toast.error(res.message)
    toast.success(res.message)
    if(onClose) onClose()
    return
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ToastContainer position="top-center" />

      <div className="space-y-4">
        <div>
          <label className="font-semibold text-sm">Título</label>
          <input
            type="text"
            max={190}
            required
            onChange={(e) => {
              setTitle(e.target.value)
              if (onTitleChange) onTitleChange(e.target.value)
            }}
            placeholder="Digite o título da publicação"
            className="w-full mt-1 rounded-lg  border border-gray-300/20 p-2 focus:ring-2 focus:ring-accent-normal focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="font-semibold text-sm">Conteúdo</label>
          <textarea
            placeholder="Escreva algo relacionado ao seu post"
            maxLength={390}
            onChange={(e) => {
              setContent(e.target.value)
              if (onContentChange) onContentChange(e.target.value)
            }}
            className="w-full mt-1 min-h-24 rounded-lg border border-gray-300/20 p-2 resize-none focus:ring-2 focus:ring-accent-normal focus:outline-none transition-all"
          ></textarea>
        </div>

        <div>
          <label className="font-semibold text-sm">Imagens</label>
          <input
            multiple
            type="file"
            onChange={(e) => {
              setFileUpdated(true)
              handleFileChange(e)
              const fileList = e.target.files
              const values = []
              for (const i of fileList!) values.push(i)
              setFiles(values)
            }}
            className="block mt-2 text-sm  file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-normal file:text-white hover:file:bg-accent-hover cursor-pointer"
          />
        </div>

        {/* Preview grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {previews.map((src, idx) => (
            <div
              key={idx}
              className="relative w-full aspect-square overflow-hidden rounded-lg border border-gray-200/20 shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={src}
                alt={`preview-${idx}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            className="w-full p-2 bg-accent-normal text-white rounded-lg font-medium hover:bg-accent-hover transition-colors duration-200"
            type="submit"
          >
            Concluir
          </button>
        </div>
      </div>
    </form>
  )
}
