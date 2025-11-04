import { PartialPostInputs, PostInputs } from "../schemas/post.schema";
import prisma from "../prisma.config";
import PostErrorHandler from "../errors/PostErrorHandler";







const postService = {


    createPost: async (data: PostInputs, id_user: string) => {
        try {
            if (!id_user) throw PostErrorHandler.unauthorized("Id não fornecido")
            data.id_user = id_user

            return await prisma.post.create({ data })
        }
        catch (e) {
            throw PostErrorHandler.internal("Não foi possivel criar o post", e)
        }
    },

    putPost: async (data: PartialPostInputs, id_post: string) => {
        try {
            return await prisma.post.update({ data, where: { id_post } })
        }

        catch (e: unknown) {
            console.log(e)
            throw PostErrorHandler.internal("Não foi possivel editar o post")
        }


    },


    findPostById: async ({ id_post }: { id_post: string }) => {

        return await prisma.post.findUnique({
            where: { id_post }, include: {
                comments: { include: { replies: true, user: true } }, user: {
                    select: {
                        id_user: true,
                        username: true,
                        email: true,
                        profile_image: true,

                    }
                }
            }
        });

    }

    ,

    findPosts: async ({ page = 1, limit = 10 }: { page: number, limit: number }) => {
        const skip = (page - 1) * limit;

        // Executando duas queries
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    user: true,
                    comments: { include: { replies: true, user: true } },
                },
            }),
            prisma.post.count(),
        ]);

        return {
            posts,
            total,
            pages: Math.ceil(total / limit),
            page,
        };
    },


    findPostsByIdUser: async (id_user: string, { page = 1, limit = 10 }) => {
        const skip = (page - 1) * limit


        return await prisma.post.findMany({ where: { id_user }, skip: skip, take: limit, include: { user: true, comments: true }, orderBy: { createdAt: "desc" } }) ?? []
    },

    deletePostById: async (id_post: string) => {
        return await prisma.post.delete({ where: { id_post } })
    }




}
export default postService