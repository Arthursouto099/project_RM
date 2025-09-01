import { tokenActions } from "../@tokenSettings/token";




export type Payload = {
    id_user: string,
    email: string,
    cpf: string,
    name: string

}
export default function useAuth() {
    const token = tokenActions.getToken()

    if(!token) return {payload: null, isAuthenticated: false}

    try {
        const payload: Payload = tokenActions.decodeToken(token)
        return {payload: payload, isAuthenticated: true}
    }

    catch {
        return {payload: null, isAuthenticated: false}
    }



}