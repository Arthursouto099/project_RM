import { isAxiosError } from "axios";
import instanceV1 from "./api@instance/ap-v1i";
import { tokenActions } from "@/@tokenSettings/token";
import type { CommonUserProps } from "@/pages/protectedRoutes/Me";

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    username: string;
    email: string;
    password: string;
    cpf: string;
    contact?: string
}

export interface DefaultResponseAPI {
    message: string;
    success: boolean;
    code?: number;
    data?: unknown;
    requestTime?: string;
}

export type CommonUser = {
    username: string
    email: string
    password: string
    cpf: string
    birth?: Date
    profile_image?: string
    fk_address?: number
    contact?: string
    gender?:
    | "Masculino"
    | "Feminino"
    | "Não Binário"
    | "Agênero"
    | "Gênero Fluido"
    | "Transgênero"
    | "Travesti"
    | "Homem Trans"
    | "Mulher Trans"
    | "Pangênero"
    | "Bigênero"
    | "Outro"
    | "Prefiro não dizer"
    emergency_contact?: string
    bio?: string
    desc?: string
}



const UserApi = {
    login: async (data: LoginInput): Promise<DefaultResponseAPI> => {
        try {
            const isLogin = await instanceV1.post("/auth/login", data)
            console.log(isLogin)
            return {
                message: isLogin.data.message || "Não foi possível fazer login",
                success: true,
                data: isLogin.data.data
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


    post: async (data: RegisterInput): Promise<DefaultResponseAPI> => {
        try {
            const response = await instanceV1.post("/user", data);

            return {
                message: response.data.message || "Usuário registrado com sucesso",
                success: true,
                data: response.data.data,
                code: response.status,
                requestTime: new Date().toISOString(),
            };
        } catch (e) {
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


    get: async (): Promise<DefaultResponseAPI> => {
        try {
            const token = tokenActions.getToken()
            const response = await instanceV1.get(`/user?id_user=${tokenActions.decodeToken(token!).id_user}`, { headers: { Authorization: `bearer ${token}`  } })
          
            return {
                message: response.data.message || "Usuário encontrado com sucesso",
                success: true,
                data: response.data.data as CommonUser,
                code: response.status,
                requestTime: new Date().toISOString(),
            }
        }
        catch (e) {
            return {
                message: "Erro inesperado",
                success: false,
                requestTime: new Date().toISOString(),
                data: e
            }
        }
    },

    put: async (data: Partial<CommonUserProps>): Promise<DefaultResponseAPI> => {
         try {
            const token = tokenActions.getToken()
            const response = await instanceV1.put(`/user/${tokenActions.decodeToken(token!).id_user}`, data ,{ headers: { Authorization: `bearer ${token}`  } })
            
            return {
                message: response.data.message || "Usuário editado com sucesso",
                success: true,
                data: response.data.data as CommonUser,
                code: response.status,
                requestTime: new Date().toISOString(),
            }
        }
        catch (e) {
            return {
                message: "Erro inesperado",
                success: false,
                requestTime: new Date().toISOString(),
                data: e
            }
        }
    }
};


export default UserApi