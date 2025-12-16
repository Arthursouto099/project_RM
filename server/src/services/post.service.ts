import { PartialPostInputs, PostInputs } from "../schemas/post.schema";
import prisma from "../prisma.config";
import PostErrorHandler from "../errors/PostErrorHandler";
import { Pagination } from "../interfaces/Pagination";
import { getSkipQuantity } from "../utils";
import { Prisma } from "@prisma/client";






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
            where: { id_post },
            include: {
                user: {
                    select: {
                        id_user: true,
                        username: true,
                        email: true,
                        profile_image: true,
                        verified: true,
                        accountType: true,
                        professionalType: true,
                        
                    },
                },
                reportRequests: true
            
            }
        })
    }
    ,


    reportPost: async (data: Omit<Prisma.ReportRequestCreateInput, 'id_report'| 'status'>) => {
        return await prisma.reportRequest.create({data})
    }
    ,

    findPosts: async (pagination: Pagination) => {


        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                skip: getSkipQuantity(pagination),
                take: pagination.limit,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { id_user: true, username: true, profile_image: true, verified: true, accountType: true, professionalType: true } },
                },
            }),
            prisma.post.count(),
        ]);

        return {
            posts,
            total,
            pages: Math.ceil(total / pagination.limit),
            page: pagination.page,
        };
    },



    findPostsByIdUser: async (id_user: string, pagination: Pagination) => {

        return await prisma.post.findMany({
            where: { id_user }, skip: getSkipQuantity(pagination), take: pagination.limit, include: {
                user: true,
                comments: {
                    include: {
                        replies: { include: { user: { omit: { password: true } } } },
                        user: { omit: { password: true } }
                    }
                }
            }, orderBy: { createdAt: "desc" }
        }) ?? []
    },

    deletePostById: async (id_post: string) => {
        return await prisma.post.delete({ where: { id_post } })
    }




}
export default postService