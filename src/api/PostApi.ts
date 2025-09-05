import { isAxiosError } from "axios";
import instanceV1 from "./api@instance/ap-v1i";
import type { DefaultResponseAPI } from "./UserApi";
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
}

const PostApi = {
    create: async (data:  Post): Promise<DefaultResponseAPI> => {
        try {
            const token = tokenActions.getToken()
            const isCreatedPost = await instanceV1.post("/post", data, {headers: {Authorization: `bearer ${token}`}})
            console.log(isCreatedPost)
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
    }

}

export default PostApi