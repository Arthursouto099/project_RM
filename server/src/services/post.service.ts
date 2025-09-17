import { PostInputs } from "../schemas/post.schema";
import prisma from "../prisma.config";
import PostErrorHandler from "../errors/PostErrorHandler";






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

    findPosts: async ({page = 1, limit = 10}) => {
        const skip = (page - 1)  * limit 
        


        // executando duas querys
        const [posts, total] = await Promise.all([
            prisma.post.findMany({skip: skip, take: limit, orderBy: {createdAt: "desc"}, include: {user: true}}),
            prisma.post.count()
        ])


        return {
            posts,
            total,
            pages: Math.ceil(total / limit),
            page
        }
    },

    findPostsByIdUser: async (id_user: string) => {
        return await prisma.post.findMany({ where: { id_user }, include: {user: true, comments: true} }) ?? []
    },

    




}

export default postService