import { Prisma } from "@prisma/client"
import prisma from "../prisma.config"
import PostErrorHandler from "../errors/PostErrorHandler";



export const commentService = {
    createComment: async (data: Prisma.CommentCreateInput, { id_user, id_post,  parentCommentId}: { id_user: string, id_post: string, parentCommentId?: string }) => {
        try {

            const createData: Prisma.CommentCreateInput = {
                content: data.content,
                post: {connect: {id_post}},
                user: {connect: {id_user}},
            }


            if(parentCommentId) {
                createData.parentComment = {connect: {id_comment: parentCommentId}}
            }
          
            return await prisma.comment.create({data})

        }
        catch (e) {
            throw PostErrorHandler.internal("Não foi possivel criar o comentario", e)
        }
    },

    
    
}


export default commentService