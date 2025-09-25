import { NextFunction, Request, Response } from "express";
import commonUserService from "../services/common_user.service";
import { responseOk } from "../config/responses/app.response";
import UserErrorHandler from "../errors/UserErrorHandler";
import { CustomRequest } from "../types/CustomRequest";
import prisma from "../prisma.config";






const commonUserController = {


   

    post: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cm = await commonUserService.createCommonUser(req.body)
            responseOk(res, "Usuário criado com sucesso", cm, 201);

        }

        catch (e) {
            next(e)
        }
    },


    put: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const upCm = await commonUserService.putUserForUniqueKey(req.body, req.params.id_user)
            responseOk(res, "Usuário editado com sucesso", upCm, 200);

        }

        catch (e) {
            next(e)
        }
    },



    addFriend:  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try{
            if(!req.userLogged?.id_user) throw UserErrorHandler.unauthorized()
            if(!req.body.id_user) throw UserErrorHandler.unauthorized()
            const initRelation = await commonUserService.addFriend(req.userLogged.id_user, req.body.id_user)
            responseOk(res, "Relação criada com sucesso", initRelation)
        }
        catch(e) {
            next(e)
        }
    },


    getMutualFriends: async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
             if(!req.userLogged?.id_user) throw UserErrorHandler.unauthorized()
             const mutualRelations = await commonUserService.getMutualFriends(req.userLogged.id_user)
             responseOk(res, "Relação criada com sucesso", mutualRelations)
        }   
        catch(e) {
            next(e)
        } 
    },



    findForUniqueKey: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id_user, email, cpf } = req.query;


            if (!id_user && !email && !cpf) {
                responseOk(res, "Busca realizada com sucesso", await commonUserService.findUsers(), 200)
            }

            const cm = await commonUserService.findUser({
                id_user: typeof id_user === "string" ? id_user : undefined,
                email: typeof email === "string" ? email : undefined,
                cpf: typeof cpf === "string" ? cpf : undefined
            })


            if (!cm) throw UserErrorHandler.notFound("Usuario não encontrado.")


            responseOk(res, "Usuario econtrado com sucesso", cm, 200)
        }
        catch (e) {
            next(e)
        }
    },
    deleteForUniqueKey: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id_user, email, cpf } = req.query;


            if (!id_user && !email && !cpf) {
                throw UserErrorHandler.validation("Informe id_user, email ou cpf para buscar o usuário.");
            }



            const cm = await commonUserService.deleteUser({
                id_user: typeof id_user === "string" ? id_user : undefined,
                email: typeof email === "string" ? email : undefined,
                cpf: typeof cpf === "string" ? cpf : undefined
            })

            console.log(cm)

            if (!cm) throw UserErrorHandler.notFound("Usuario não encontrado.")

            responseOk(res, "Usuario econtrado com sucesso", cm, 200)

        }
        catch (e) {
            next(e)
        }
    },







    // get: async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         return await commonUserService.
    //     }
    //     catch(e) {
    //         next(e)
    //     }
    // } 


}

export default commonUserController