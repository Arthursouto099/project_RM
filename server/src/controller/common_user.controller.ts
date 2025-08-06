import { NextFunction, Request, Response } from "express";
import commonUserService from "../services/common_user.service";
import { responseOk } from "../config/responses/app.response";

const commonUserController = {

    post: async (req: Request, res: Response, next: NextFunction) => {
        try{
            const cm =  await commonUserService.createCommonUser(req.body)
            responseOk(res, "Usuário criado com sucesso", cm, 201);
            
        }

        catch(e) {
            next(e)
        }
    }


}

export default commonUserController