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
        




        try {
            const parentCommentId =
                req.query.parentCommentId && req.query.parentCommentId !== "undefined"
                    ? String(req.query.parentCommentId)
                    : undefined;


            const comment = await commentService.createComment({ content: req.body.content }, {
                id_post: req.body.id_post,
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                id_user: req.userLogged?.id_user!,
                parentCommentId
            })


          
            io.to("commentRoom").emit("commentCreated",  await commentService.findCommentById({id_comment: comment.id_comment}))

        





            responseOk(res, "comentario criado com sucesso", comment, 200)
        }
        catch (e) {
            next(e)
        }
    }
}


export default commentController