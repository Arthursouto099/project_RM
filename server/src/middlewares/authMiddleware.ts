import { Request, Response, NextFunction } from "express";
import {tokenConfig} from "../config/@tokenconfig/tokenConfig"
import { Payload } from "../config/@tokenconfig/tokenConfig"
import { CustomRequest } from "../types/CustomRequest";

export default function authMiddleware (req: CustomRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    
    
    // trocar para um erro mais especializado
    if(!authHeader) {
         res.status(401).json({message: "Não autorizado"})
        return
    }

    const token = authHeader.split(" ")[1]
    const payload =   tokenConfig.verifyToken(token) as Payload

    if(!payload) {
         res.status(401).json({message: "Não autorizado"})
        return
    }
    
    
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req.userLogged = {
        email: payload.email,
        cpf: payload.cpf,
        id_user: payload.id_user,
        name: payload.name
    }

    next()
}