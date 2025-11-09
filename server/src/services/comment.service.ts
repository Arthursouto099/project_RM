import { Prisma } from "@prisma/client"
import prisma from "../prisma.config"
import PostErrorHandler from "../errors/PostErrorHandler";
import { Pagination } from "../interfaces/Pagination";



export const commentService = {
    createComment: async (data: {content: string,}, { id_user, id_post, parentCommentId }: { id_user: string, id_post: string, parentCommentId?: string }) => {
        try {

            const createData: Prisma.CommentCreateInput = {
                content: data.content,
                post: { connect: { id_post } },
                user: { connect: { id_user } },
            }


            if (parentCommentId) {
                createData.parentComment = { connect: { id_comment: parentCommentId } }
            }

            return await prisma.comment.create({data: createData})

        }
        catch (e) {
            console.log(e)
            throw PostErrorHandler.internal("Não foi possivel criar o comentario", e)
            
        }
    },


    findAllCommentsByPost: async ({ page = 1, limit = 5 }: Pagination, { id_post }: { id_post: string }) => {
        const skip = (page - 1) * limit

        return await prisma.comment.findMany({
            where: {id_post},
            skip,
            take: limit,
            include: {replies: {include: {user: {select: {
                id_user: true,
                nickname: true,
                profile_image: true,
                username: true
            }}}}, user: {select: {
                id_user: true,
                nickname: true,
                profile_image: true,
                username: true
            }}},
            orderBy: {createdAt: "desc"}

        }) ?? []
    }



}


export default commentService