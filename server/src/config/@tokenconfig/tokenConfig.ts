import * as webTokenConfig from "jsonwebtoken"
import "dotenv/config"
import { verify } from "crypto"
import { string } from "zod"


export type Payload = {
    id_user: string,
    email: string,
    cpf: string

}

export const tokenConfig = {

    // gerando meu token e retornando
    generateToken: (payload: Payload)  => {
       return webTokenConfig.sign(
            payload, 
            process.env.JWT_SECRET!,
            {expiresIn: "2h"}
         )
    },

    // verificando se o token é válido
    verifyToken: (token: string) => {
        try {
            return webTokenConfig.verify(token, process.env.JWT_SECRET!)
        }
        catch(e) {
            console.log(e)
            return null
        }
    }









}

