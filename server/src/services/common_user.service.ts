
import { CommonUser, PartialUserInputs } from "../schemas/common_user.schema"
import prisma from "../prisma.config";
import { Prisma } from "@prisma/client";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import UserErrorHandler from "../errors/UserErrorHandler";
import * as bc from "bcrypt"




// criando um objeto, com boas praticas
const commonUserService = {


    createCommonUser: async (data: CommonUser) => {
        try {
            data.password = await bc.hash(data.password, 10)
            return await prisma.commonUser.create({ data: data })
        }

        catch (e) {

            if (e instanceof PrismaClientKnownRequestError) {

                if (e.code === "P2002") {
                    throw UserErrorHandler.validation("Usuário com este dado já existe", e.meta);
                }

                // Outros erros conhecidos
                throw UserErrorHandler.internal("Erro no banco de dados", e);
            }

            if (e instanceof Error) {
                throw UserErrorHandler.internal(e.message, e);
            }

            throw UserErrorHandler.internal("Erro inesperado ao criar usuário", e);
        }
    },

    findUser: async ({ id_user, email, cpf }: { id_user?: string, email?: string, cpf?: string }) => {
        try {
            const where: Prisma.CommonUserWhereInput = {
                ...(id_user ? { id_user: id_user } : {}),
                ...(email ? { email: email } : {}),
                ...(cpf ? { cpf: cpf } : {})
            }


            return await prisma.commonUser.findFirst({ where: where })
        }

        catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {


                throw UserErrorHandler.internal("Erro no banco de dados", e)
            }

            if (e instanceof Error) {
                throw UserErrorHandler.internal("Erro no banco de dados", e)
            }

            throw UserErrorHandler.internal("Erro inesperado ao deletar usuário", e);


        }
    },


    findUsers: async ({page = 1, limit = 10}) => {
        const skip = (page - 1) * limit


        const [users, total] = await Promise.all([
            prisma.commonUser.findMany({skip: skip, take: limit, orderBy: {createdAt: "desc"}}),
            prisma.commonUser.count({})
        ])

        return {
            users,
            total,
            pages: Math.ceil(total / limit),
            page
        }
        
    },



    addFriend: async (friend1ID: string, friend2ID: string) => {
        try {
            const initRelation = await prisma.$transaction([
                 prisma.commonUser.update({where: {id_user: friend1ID}, data: {friends: {connect: {id_user: friend2ID}}}}),
                 prisma.commonUser.update({where: {id_user: friend2ID}, data: {friends: {connect: {id_user: friend1ID}}}})

            ])

            return {
                user1: initRelation[0],
                user2: initRelation[1]
            }

        }

        catch(e) {
            if(e instanceof UserErrorHandler) throw e

            if(e instanceof PrismaClientKnownRequestError) throw  UserErrorHandler.internal(e.message)
            
            throw UserErrorHandler.internal()
            
        }



    },


    getMutualFriends: async (id_user: string) => {
        try {
            const friends = await prisma.commonUser.findUnique({where: {id_user}, select: {friendOf: true, friends: true}})


            // filtro as amizades<1 === 1> para ambos
            const mutualFriends = friends?.friends.filter((friend) => {
                // some indetifica um padrão e me retorna apenas um dos elementos repitidos na lista
                return friends.friendOf.some((f) => f.id_user === friend.id_user)
            })
            return mutualFriends
        }
        catch(e) {
            if(e instanceof UserErrorHandler) throw e

            if(e instanceof PrismaClientKnownRequestError) throw  UserErrorHandler.internal(e.message)
            
            throw UserErrorHandler.internal()
        }
    },

    sendRequestFriend: async ( id_requester: string, id_received: string) => {
        try {
            const sendRequest = await prisma.friendRequest.create({data: {id_requester: id_requester, id_receiver: id_received  }})
            
            return sendRequest
        }
        catch(e) {
            if(e instanceof UserErrorHandler) throw e

            if(e instanceof PrismaClientKnownRequestError) throw  UserErrorHandler.internal(e.message)
            
            throw UserErrorHandler.internal()
        }
    }
    ,

    acceptRequestFriend: async(id_request: string) => {
         try {
            const sendRequest = await prisma.friendRequest.update({data: {status: "accepted"}, where: {id_request}})
            if(!sendRequest) throw new UserErrorHandler("Requisição de amizade não encontrada", "REQUEST_ERROR", 500)
            return sendRequest
        }
        catch(e) {
            if(e instanceof UserErrorHandler) throw e

            if(e instanceof PrismaClientKnownRequestError) throw  UserErrorHandler.internal(e.message)
            
            throw UserErrorHandler.internal()
        }
    },



    putUserForUniqueKey: async (data: PartialUserInputs, id_user: string) => {
        try {
            const updated = await prisma.commonUser.update({ where: { id_user: id_user }, data })
            if (!updated) throw new UserErrorHandler("Problema ao editar o usuario", undefined, updated, 500)
            return updated
        }
        catch (e) {
            if (e instanceof UserErrorHandler) {
                throw e
            }
            if (e instanceof PrismaClientKnownRequestError) {
                throw UserErrorHandler.internal("Falha na comunicação com o servidor")
            }

            throw UserErrorHandler.internal()
        }
    }


    ,



    deleteUser: async ({ id_user, email, cpf }: { id_user?: string, email?: string, cpf?: string }) => {
        try {
            let where: Prisma.CommonUserWhereUniqueInput


            if (id_user) {
                where = { id_user }
            }

            else if (email) {
                where = { email }
            }

            else {
                where = { cpf }
            }




            if (!where) {
                throw new UserErrorHandler("Identificador não fornecido");
            }

            return await prisma.commonUser.delete({ where: where });



        }
        catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {

                throw UserErrorHandler.internal("Erro no banco de dados", e)

            }

            if (e instanceof Error) {
                throw UserErrorHandler.internal("Erro no banco de dados", e)
            }

            if (e instanceof UserErrorHandler) {
                throw e
            }

            throw UserErrorHandler.internal("Erro inesperado ao deletar usuário", e);

        }
    }








}

export default commonUserService