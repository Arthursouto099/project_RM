import PostApi from "@/api/PostApi"
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

import { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { CarouselImgs } from "./carousel"
import { DialogDescription } from "@radix-ui/react-dialog"



export function DialogCreatePost() {
  const [preview, setPreview] = useState<string[]>([])
  const [prevTitle, setPrevTitle] = useState<string>("")
  const [prevContent, setPrevContent] = useState<string>("")


  return (
    <Dialog>
      <DialogTrigger asChild>
        <h1 className="cursor-pointer ">
          Criar
        </h1>
      </DialogTrigger>

      <DialogContent className="sm:max-w-5xl w-full h-[90%] rounded-2xl shadow-xl border border-gray-200 bg-white">
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <div className="text-xl font-semibold text-gray-800">
                Criar Publicação
              </div>
              <div className="text-lg font-medium text-gray-500">
                Visualizar Publicação
              </div>
            </div>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="md:flex gap-10 w-full px-6 py-4">
          {/* Lado do Formulário */}
          <div className="flex flex-1 items-start">
            <div className="w-full">
              <CreatePostForm
                onPreviewsChange={(e) => setPreview(e)}
                onContentChange={(c) => setPrevContent(c)}
                onTitleChange={(t) => setPrevTitle(t)}
              />
            </div>
          </div>

          {/* Lado da Visualização */}
          <div className="flex flex-col w-3 flex-1 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
            <h1 className="break-words text-3xl font-bold text-gray-800">
              {prevTitle}
            </h1>

            <p className="break-words overflow-y-auto max-h-[20%] text-gray-600 leading-relaxed">
              {prevContent}
            </p>

            <div className="flex justify-center items-center">
              {preview.length > 0 ? (
                <CarouselImgs urls={preview} />
              ) : (
                <div className="w-full h-40 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 rounded-lg">
                  Sem imagens
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
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
}


export function CreatePostForm({ onPreviewsChange, onTitleChange, onContentChange }: CreatePostProps) {
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [files, setFiles] = useState<File[] | null>()
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isFileUpdated, setFileUpdated] = useState<boolean>(false)
  const [previews, setPreviews] = useState<string[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // cria urls temporárias
    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(urls);

    if (onPreviewsChange) onPreviewsChange(urls)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()



    if (isFileUpdated && files) {
      const urls: string[] = [];

      // usar Promise.all para aguardar todos uploads
      await Promise.all(
        Array.from(files).map(async (file) => {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(7)}.${fileExt}`;

          const { error } = await supabase.storage
            .from("images")
            .upload(fileName, file, { upsert: true });

          if (error) {
            console.error("Erro no upload:", error.message);
            return;
          }

          const { data } = supabase.storage.from("images").getPublicUrl(fileName);

          if (data?.publicUrl) {
            urls.push(data.publicUrl); // usa direto o publicUrl retornado
          }
        })



      );

      setImageUrls(urls)

      const res = await PostApi.create({ title, content, images: urls })
      if (!res.success) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      return
    }

    const res = await PostApi.create({ title, content })
    if (!res.success) {
      toast.error(res.message)
      return
    }
    toast.success(res.message)
    return











    // const res = await UserApi.login({ email: email, password: password })
    // 




    // tokenActions.setToken(res.data as string)
    // navigate("/home")


  }

  return (
    <form onSubmit={onSubmit}>
      <ToastContainer position="top-center" />

      <div className="grid grid-cols-2 gap-5 ">
        <div className="col-span-2">
          <label htmlFor="" className=""> <h1 className="font-semibold">Titulo</h1></label>
          <input type="text" required onChange={(e) => {
            setTitle(e.target.value)
            if (onTitleChange) onTitleChange(e.target.value)
          }} placeholder="example@gmail.com" className="border-b-1  w-full focus:outline-none focus:border-accent-normal focus:ring-0 p-1 border-gray-300" />
        </div>
        <div className="col-span-2">
          <label htmlFor="" className=""> <h1 className="font-semibold">Conteudo</h1></label>
          <textarea onChange={(e) => {
            setContent(e.target.value)
            if (onContentChange) onContentChange(e.target.value)
          }} className="border-b-1 min-h-20  w-full focus:outline-none focus:border-accent-normal focus:ring-0 p-1 border-gray-300">

          </textarea>
        </div>
        <div className="col-span-2">
          <label htmlFor="" className=""> <h1 className="font-semibold">Imagens</h1></label>
          <input multiple type="file" onChange={(e) => {
            setFileUpdated(true)
            handleFileChange(e)
            const fileList = e.target.files
            const values = []
            for (const i of fileList!) {
              values.push(i)
            }
            setFiles(values)
          }} />
        </div>

        <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {previews.map((src, idx) => (
            <div
              key={idx}
              className="relative w-full aspect-square overflow-hidden rounded-lg border border-gray-200 shadow-sm"
            >
              <img
                src={src}
                alt={`preview-${idx}`}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="flex  col-span-2 gap-2">

          <button className="  p-2 bg-accent-normal w-full rounded-md text-white" type="submit" >Postar</button>

        </div>







      </div>

    </form>
  )
}