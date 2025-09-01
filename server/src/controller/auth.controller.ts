import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";
import { responseOk } from "../config/responses/app.response";



const auhtController = {

login: async (req: Request, res: Response, next: NextFunction) => {   
    try {
        const token = await  authService.login(req.body)
        responseOk(res, "Usuario logado com sucesso", token, 200)

    }
    catch(e){
        next(e)
    }

}


}

export default auhtController