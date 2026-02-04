import { z } from "zod";

export const postSchema = z.object({
  id_post: z.string().optional(), // geralmente gerado pelo banco
  id_user: z.string().default("0000000000000"),
  title: z.string().min(1, "O título é obrigatório"),
  content: z.string().min(1, "O conteúdo é obrigatório"),
  region: z.string().min(2, "A região é obrigatória").optional(),
  images: z.array(z.url()).optional(),
  videos: z.array(z.url()).optional(),
  updatedAt: z.date().optional(),
  createdAt: z.date().optional()
}).strict();



export const getAllPostsInputs = z.object({
  page: z.number().default(1),
  limit: z.number().default(10)
}).strict()



export const postSchemaPartial = postSchema.partial().strict()

export type PostInputs = z.infer<typeof postSchema>
export type PartialPostInputs = z.infer<typeof postSchemaPartial>
export type GetAllPostsInputs = z.infer<typeof getAllPostsInputs>