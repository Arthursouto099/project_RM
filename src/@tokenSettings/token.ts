import { jwtDecode } from "jwt-decode"
import type { Payload } from "../hooks/useAuth"



export const tokenActions = {

    setToken: (token: string): void => {
        localStorage.setItem("token", token)
    },


    getToken: (): string | null => {
        return localStorage.getItem("token")
    },

    removeToken: (): void => {
        localStorage.removeItem("token")
    },

    decodeToken: (token: string) => {
        return jwtDecode(token) as Payload
    }


    



}


