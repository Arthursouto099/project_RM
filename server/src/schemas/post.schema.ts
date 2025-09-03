import { z } from "zod";

export const postSchema = z.object({
  id_post: z.string().optional(), // geralmente gerado pelo banco
  id_user: z.string().default("0000000000000"),
  title: z.string().min(1, "O título é obrigatório"),
  content: z.string().min(1, "O conteúdo é obrigatório"),
  region: z.string().min(2, "A região é obrigatória").optional(),
//   videos: z.array(z.object({
//     id: z.string().optional(),
//     url: z.string().url("URL do vídeo inválida"),
//     postId: z.string().optional()
//   })).optional(),
//   images: z.array(z.object({
//     id: z.string().optional(),
//     url: z.string().url("URL da imagem inválida"),
//     postId: z.string().optional()
//   })).optional(),
//   comments: z.array(z.object({
//     id_comment: z.string().optional(),
//     id_post: z.string().optional(),
//     content: z.string().min(1, "Comentário não pode ser vazio"),
//     updatedAt: z.date().optional(),
//     createdAt: z.date().optional(),
//   })).optional(),
  updatedAt: z.date().optional(),
  createdAt: z.date().optional()
}).strict();

export const postSchemaPartial = postSchema.partial().strict()

export type PostInputs = z.infer< typeof postSchema>
export type PartialPostInputs = z.infer<typeof postSchema>