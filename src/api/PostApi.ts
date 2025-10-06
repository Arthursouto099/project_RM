import { isAxiosError } from "axios";
import instanceV1 from "./api@instance/ap-v1i";
import type { CommonUser, DefaultResponseAPI } from "./UserApi";
import { tokenActions } from "@/@tokenSettings/token";

export type Post = {
    id_post?: string
    title: string
    content: string
    region?: string
    images?: string[]   // URLs ou ObjectURL para preview
    videos?: string[]   // URLs ou ObjectURL para preview
    createdAt?: Date
    updatedAt?: Date
    user?: CommonUser
}


export type Posts = {
    posts: Post[]
    page: number,
    pages: number,
    total: number
}



const PostApi = {
    findPosts: async (page: number, limit = 10) => {

        try {
            const allPosts = await instanceV1.get(`/post?page=${page}&limit=${limit}`)
            return {
                message: allPosts.data.message,
                success: true,
                data: allPosts.data.data as Posts
            }
        }
        catch (e) {
            if (isAxiosError(e)) {
                return {
                    message: e.response?.data?.message || "Erro ao conectar com o servidor",
                    success: false,
                    code: e.response?.status,
                    requestTime: new Date().toISOString(),
                };
            }

            return {
                message: "Erro inesperado",
                success: false,
                requestTime: new Date().toISOString(),
            };
        }


    },


    create: async (data: Post): Promise<DefaultResponseAPI> => {
        try {
            const token = tokenActions.getToken()
            const isCreatedPost = await instanceV1.post("/post", data, { headers: { Authorization: `bearer ${token}` } })
            return {
                message: isCreatedPost.data.message || "Não foi possível realizar a publicação",
                success: true,
                data: isCreatedPost.data.data as Post
            }
        }
        catch (e) {

            if (isAxiosError(e)) {
                return {
                    message: e.response?.data?.message || "Erro ao conectar com o servidor",
                    success: false,
                    code: e.response?.status,
                    requestTime: new Date().toISOString(),
                };
            }

            return {
                message: "Erro inesperado",
                success: false,
                requestTime: new Date().toISOString(),
            };
        }
    },
    findPostsByMe: async (id_user: string, {page = 1, limit = 10})=> {
        try {
            const token = tokenActions.getToken()
            const isFindedPosts = await instanceV1.get(`/post/${id_user}?page=${page}&limit=${limit}`, { headers: { Authorization: `bearer ${token}` } })
            return {
                message: isFindedPosts.data.message || "Não foi possível realizar a publicação",
                success: true,
                data: isFindedPosts.data.data as Post[]
            }
        }
        catch (e) {

            if (isAxiosError(e)) {
                return {
                    message: e.response?.data?.message || "Erro ao conectar com o servidor",
                    success: false,
                    code: e.response?.status,
                    requestTime: new Date().toISOString(),
                };
            }

            return {
                message: "Erro inesperado",
                success: false,
                requestTime: new Date().toISOString(),
            };
        }
    }

}

export default PostApi