import { isAxiosError } from "axios";
import instanceV1 from "./api@instance/ap-v1i";
import type { CommonUser, DefaultResponseAPI } from "./UserApi";
import { tokenActions } from "@/@tokenSettings/token";

export type Post = {
    id_post?: string
    title: string
    content: string
    region?: string
    images?: string[]  
    videos?: string[]   
    createdAt?: Date
    updatedAt?: Date
    user?: CommonUser
    comments?: Comment[]
}

export type Comment = {
    id_comment?: string;
    id_post: string;
    post?: Post;          
    id_user?: string;
    user?: CommonUser;    
    content: string;
    updatedAt?: Date;
    createdAt?: Date;
    parentCommentId?: string | null;
    parentComment?: Comment | null;  
    replies?: Comment[];
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

    findComments: async (page: number, limit = 10, id_post: string) => {

        try {
            const allComments = await instanceV1.get(`/post/comment/${id_post}?page=${page}&limit=${limit}`)
            return {
                message: allComments.data.message,
                success: true,
                data: allComments.data.data as Posts
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

     createComment: async (data: Comment) => {
        let url_string: string = ""

        if(data.parentCommentId) {
            url_string = `/post/comment/${data.id_post}?parentCommentId=${data.parentCommentId}`
        }
        else url_string = `/post/comment/${data.id_post}`

        try {
            const token = tokenActions.getToken()
            const comment = await instanceV1.post(url_string, data, { headers: { Authorization: `bearer ${token}` } })
            return {
                message: comment.data.message || "Não foi possível realizar a publicação",
                success: true,
                data: comment.data.data as Post
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

    delete: async ({ id_post }: { id_post: string }): Promise<DefaultResponseAPI> => {
        try {
            const token = tokenActions.getToken()
            const postDeleted = await instanceV1.delete("/post/" + id_post, { headers: { Authorization: `bearer ${token}` } })
            return {
                message: postDeleted.data.message || "Não foi possível realizar a publicação",
                success: true,
                data: postDeleted.data.data as Post
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

    update: async (data: Partial<Post>): Promise<DefaultResponseAPI> => {
        try {
            const token = tokenActions.getToken()
            const isUpdatedPost = await instanceV1.put(`/post/${data.id_post}`, data, { headers: { Authorization: `bearer ${token}` } })
            return {
                message: isUpdatedPost.data.message || "Não foi possível realizar a publicação",
                success: true,
                data: isUpdatedPost.data.data as Post
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
    findPostsByMe: async (id_user: string, { page = 1, limit = 10 }) => {
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