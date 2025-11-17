import { Request, Response, NextFunction } from "express"
import commentService from "../services/comment.service"
import { responseOk } from "../config/responses/app.response"
import { CustomRequest } from "../types/CustomRequest"
import { io } from "../app"





const commentController = {
    findComments: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comments = await commentService.findAllCommentsByPost({ page: Number(req.query.page ?? 1), limit: Number(req.query.limit ?? 5) }, { id_post: req.params.id_post })
            responseOk(res, "consulta feita com sucesso", comments, 200)
        }
        catch (e) {
            next(e)
        }
    },


    createComment: async (req: CustomRequest, res: Response, next: NextFunction) => {
        const parentCommentId = req.query.parentCommentId && req.query.parentCommentId !== "undefined" ? String(req.query.parentCommentId) : undefined;

        try {
            const comment = await commentService.createComment({ content: req.body.content }, {
                id_post: req.body.id_post,
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                id_user: req.userLogged?.id_user!,
                parentCommentId
            })

            // caso tenha o id de um comentario pai
            // neste caso eu retorno o comentario pai completo com todas as repostas
            if (parentCommentId) io.to("commentRoom").emit("replyCreated", await commentService.findCommentById({ id_comment: comment.id_comment }))
             else io.to("commentRoom").emit("commentCreated", await commentService.findCommentById({ id_comment: comment.id_comment }))

            

            responseOk(res, "comentario criado com sucesso", comment, 200)
        }
        catch (e) {
            next(e)
        }
    },

    putComment: async (req: CustomRequest, res: Response, next: NextFunction) => {
        const parentCommentId = req.query.parentCommentId && req.query.parentCommentId !== "undefined" ? String(req.query.parentCommentId) : undefined;
        try {
            const comment = await commentService.putComment({ id_comment: req.params.id_comment, data: req.body.content })


            if (parentCommentId) io.to("commentRoom").emit("replyUpdated", await commentService.findCommentById({ id_comment: comment.id_comment }))
            else io.to("commentRoom").emit("commentUpdated", await commentService.findCommentById({ id_comment: comment.id_comment }))



            responseOk(res, "comentario editado com sucesso", comment, 200)
        }
        catch (e) {

            next(e)
        }
    },


    findRepliesByParentId: async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const replies = await commentService.findRepliesByIdComment({
                id_comment: req.params.id_comment, pagination: {
                    page: Number(req.query.page ?? 1), limit: Number(req.query.limit ?? 5)
                }
            })
            responseOk(res, "consulta feita com sucesso", replies, 200)
        }
        catch (e) {
            next(e)
        }
    },


    deleteComment: async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const comment = await commentService.deleteComment({ id_comment: req.params.id_comment })

            io.to("commentRoom").emit("commentDeleted", await commentService.findCommentById({id_comment: comment.id_comment }))
            responseOk(res, "comentario deletado com sucesso")
        }
        catch (e) {
            next(e)
        }
    }
}


export default commentController