import z from "zod"



export const message = z.object({
    id_chat: z.cuid(),
    content: z.string(),
    images: z.array(z.url()).optional(),
    videos: z.array(z.url()).optional(),
})



