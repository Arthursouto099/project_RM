import { Request, Response } from "express";
import {CommonUser} from "../schemas/common_user.schema"
import prisma from "../prisma.config";
import { Prisma } from "@prisma/client";
import { responseOk } from "../config/responses/app.response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import UserErrorHandler from "../errors/UserErrorHandler";





// criando um objeto, com boas praticas
const commonUserService = {


    createCommonUser:  async (data: CommonUser) => {
        try {
             return await prisma.commonUser.create({data: data})
        }

        catch (e) {
            // 🎯 Trata erros específicos do Prisma
            if (e instanceof PrismaClientKnownRequestError) {
                // 🔍 Exemplo: código P2002 => violação de unique constraint
                if (e.code === "P2002") {
                    throw UserErrorHandler.validation("Usuário com este dado já existe", e.meta);
                }
    
                // Outros erros conhecidos
                throw UserErrorHandler.internal("Erro no banco de dados", e);
            }
    
            // Outros erros JS padrão
            if (e instanceof Error) {
                throw UserErrorHandler.internal(e.message, e);
            }
    
            // Fallback para qualquer erro inesperado
            throw UserErrorHandler.internal("Erro inesperado ao criar usuário", e);
        }
    },
    
    findUser: async({id_user, email, cpf}: {id_user?: string, email?: string, cpf?: string}) => {
        try {
            const where: Prisma.CommonUserWhereInput   = {
                ...(id_user ? {id_user : id_user} : {}),
                ...(email ? {email: email} : {}),
                ...(cpf ? {cpf: cpf} : {})
            }


            return await prisma.commonUser.findFirst({where: where})
        }

        catch(e) {
            if(e instanceof PrismaClientKnownRequestError) {


                throw UserErrorHandler.internal("Erro no banco de dados", e)
            }

            if(e instanceof Error) {
                throw UserErrorHandler.internal("Erro no banco de dados", e)
            }

            throw UserErrorHandler.internal("Erro inesperado ao deletar usuário", e);


        }
    },


    deleteUser: async({id_user, email, cpf}: {id_user?: string, email?: string, cpf?: string}) => {
        try{
            let where: Prisma.CommonUserWhereUniqueInput


            if(id_user) {
                where = {id_user}
            }

            else if(email) {
                where = {email}
            }

            else {
                where = {cpf}
            }

            console.log(where)

  
        
            if (!where) {
              throw new UserErrorHandler("Identificador não fornecido");
            }

            return await prisma.commonUser.delete({where: where });

            

        }
        catch(e) {
            if(e instanceof PrismaClientKnownRequestError) {


                throw UserErrorHandler.internal("Erro no banco de dados", e)
            }

            if(e instanceof Error) {
                throw UserErrorHandler.internal("Erro no banco de dados", e)
            }

            throw UserErrorHandler.internal("Erro inesperado ao deletar usuário", e);

        }
    }





}

export default commonUserService