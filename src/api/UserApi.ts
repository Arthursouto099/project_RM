import { isAxiosError } from "axios";
import instanceV1 from "./api@instance/ap-v1i";


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
    data?: any;
    requestTime?: string;
}


const UserApi = {
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
};


export default UserApi