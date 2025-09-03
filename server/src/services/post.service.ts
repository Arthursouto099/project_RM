import { PostInputs } from "../schemas/post.schema";
import prisma from "../prisma.config";
import PostErrorHandler from "../errors/PostErrorHandler";
import { da, de } from "zod/v4/locales/index.cjs";





const postService = {


    createPost: async (data: PostInputs, id_user: string) => {
        try {
            if(!id_user) throw PostErrorHandler.unauthorized("Id não fornecido")
            data.id_user = id_user
            return await prisma.post.create({data})
        }
        catch (e) {
            throw PostErrorHandler.internal("Não foi possivel criar o post", e)
        }
    },

    findPosts: async () => {
        return await prisma.post.findMany() ?? []
    },

    findPostsByIdUser: async (id_user: string) => {
        return await prisma.post.findMany({ where: { id_user } }) ?? []
    }




}

export default postService