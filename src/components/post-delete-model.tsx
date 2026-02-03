import { Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog"; // ajuste conforme seu projeto
import PostApi from "@/api/PostApi";
import { } from "sonner"
export default function DialogDeletePost({
  children,
  onClose,
  id_post,
  onDeleted
}: {
  children: React.ReactNode,
  onClose: ()=> void,
  id_post: string,
   onDeleted: (e: string) => void

}) {


 const onDecision = async ({ id_post }: { id_post: string }) => {
  const isDeleted = await PostApi.delete({ id_post });

  if (isDeleted.success) {
    onDeleted(isDeleted.message); 
    return;
  }

  
  onClose();
};



  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="shadow-2xl border border-gray-200/20 text-sidebar-foreground bg-sidebar p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-semibold mb-6 text-center">Tem certeza que deseja excluir este post?</h2>

        <div className="flex justify-center items-center gap-6">
          <button
          onClick={ async () => {
            await onDecision({id_post})
          }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}