import { Request, Response, NextFunction } from "express";
import { responseOk } from "../config/responses/app.response";
import postService from "../services/post.service";
import PostErrorHandler from "../errors/PostErrorHandler";
import { CustomRequest } from "../types/CustomRequest";
import { io } from "../app";




const postController = {

    post: async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.userLogged?.id_user) throw PostErrorHandler.unauthorized("id não fornecido")


            const postCreated = await postService.createPost(req.body, req.userLogged.id_user)
            const postFinded = await postService.findPostById({ id_post: postCreated.id_post })
            responseOk(res, "Post criado com sucesso", postCreated, 201);

            //envia um evento para todos clientes que estão em postsRoom
            io.to("postsRoom").emit("postCreated", postFinded)
            
        }

        catch (e) {
            next(e)
        }
    },


    putPost: async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.userLogged?.id_user || !req.params.id_post) throw PostErrorHandler.unauthorized("id não fornecido")
            const updatedPost = await postService.putPost(req.body, req.params.id_post)
            const postFinded = await postService.findPostById({ id_post: updatedPost.id_post })
            responseOk(res, "Post editado com sucesso", updatedPost, 200);

            io.to("postsRoom").emit("postUpdated", postFinded)
            


        }
        catch (e) {
            next(e)
        }
    },





    findPosts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const posts = await postService.findPosts({
                page: Number(req.query.page ?? 1), limit: Number(req.query.limit ?? 10),
            }


            )
            responseOk(res, "consulta feita com sucesso", { posts: posts.posts, page: posts.page, pages: posts.pages, total: posts.total }, 200)
        }
        catch (e) {
            next(e)
        }
    },

    findForUniqueKey: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const posts = await postService.findPostsByIdUser(req.params.id_user, { page: Number(req.query.page ?? 1), limit: Number(req.query.limit ?? 10) })
            responseOk(res, "", posts, 200)

        }

        catch (e) {
            next(e)
        }
    },


    deletePostByUniqueKey: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const postDeleted = await postService.deletePostById(req.params.id_post)
            responseOk(res, "Post deletado com sucesso", null)


            io.to("postsRoom").emit("postDeleted", postDeleted)
            console.log("Post deletado", postDeleted.id_post)
        }

        catch (e) {
            next(e)
        }
    }


}


export default postController