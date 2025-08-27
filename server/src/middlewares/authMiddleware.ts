import { Request, Response, NextFunction } from "express";
import {tokenConfig} from "../config/@tokenconfig/tokenConfig"
import { Payload } from "../config/@tokenconfig/tokenConfig"


export default function authMiddleware (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    
    // trocar para um erro mais especializado
    if(!authHeader) return res.status(401).json({message: "Não autorizado"})

    const token = authHeader.split(" ")[1]
    const payload =   tokenConfig.verifyToken(token)

    if(!payload) return res.status(401).json({message: "Não autorizado"})
    
    console.log(req)
    
    req.userLogged = payload as Payload

    next()
}