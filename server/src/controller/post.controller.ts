import { Request, Response, NextFunction } from "express";
import { responseOk } from "../config/responses/app.response";
import postService from "../services/post.service";
import PostErrorHandler from "../errors/PostErrorHandler";
import { CustomRequest } from "../types/CustomRequest";



const postController = {

    post: async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.userLogged?.id_user) throw PostErrorHandler.unauthorized("id não fornecido")
            const post = await postService.createPost(req.body, req.userLogged.id_user)
            responseOk(res, "Post criado com sucesso", post, 201);

        }

        catch (e) {
            next(e)
        }
    },

    findForUniqueKey: async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.userLogged?.id_user) throw PostErrorHandler.unauthorized("id não fornecido")
            const posts = await postService.findPostsByIdUser(req.userLogged.id_user)
            responseOk(res, "", posts, 200)

        }

        catch (e) {
            next(e)
        }
    },

    findPosts: async (req: Request, res: Response) => {
      responseOk(res, "", await postService.findPosts(), 200)
    }
}


export default postController