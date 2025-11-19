import { Request, Response, NextFunction } from "express";
import { responseOk } from "../config/responses/app.response";
import postService from "../services/post.service";
import PostErrorHandler from "../errors/PostErrorHandler";
import { CustomRequest } from "../types/CustomRequest";
import { io } from "../app";
import { emitSinalByWebSocket } from '../interfaces/Socket'



const postController = {

    post: async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.userLogged?.id_user) throw PostErrorHandler.unauthorized("id não fornecido")
            const postCreated = await postService.createPost(req.body, req.userLogged.id_user)
            responseOk(res, "Post criado com sucesso", postCreated, 201);

            emitSinalByWebSocket({
                io,
                toString: "postsRoom",
                emitString: "postCreated",
                args: postService.findPostById({ id_post: postCreated.id_post })

            })
        }

        catch (e) {
            next(e)
        }
    },


    putPost: async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.userLogged?.id_user || !req.params.id_post) throw PostErrorHandler.unauthorized("id não fornecido")
            const updatedPost = await postService.putPost(req.body, req.params.id_post)
            responseOk(res, "Post editado com sucesso", updatedPost, 200);

            emitSinalByWebSocket({
                io,
                toString: "postsRoom",
                emitString: "postUpdated",
                args: postService.findPostById({id_post: updatedPost.id_post})

            })



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


                emitSinalByWebSocket({
                io,
                toString: "postsRoom",
                emitString: "postDeleted",
                args: postDeleted

            })

        }

        catch (e) {
            next(e)
        }
    }


}


export default postController