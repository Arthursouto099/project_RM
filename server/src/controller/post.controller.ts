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


    findPosts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const posts = await postService.findPosts({page: Number(req.query.page ?? 1) , limit: Number(req.query.limit ?? 1)})
            responseOk(res, "consulta feita com sucesso", {posts: posts.posts, page: posts.page, pages: posts.pages, total: posts.total}, 200)
        }
        catch(e) {
            next(e)
        }
    },

    findForUniqueKey: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const posts = await postService.findPostsByIdUser(req.params.id_user, {page: Number(req.query.page ?? 1), limit: Number(req.query.limit ?? 10)} )
            responseOk(res, "", posts, 200)

        }

        catch (e) {
            next(e)
        }
    },

  
}


export default postController