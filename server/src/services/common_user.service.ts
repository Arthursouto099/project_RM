import { Request, Response } from "express";
import {CommonUser} from "../schemas/common_user.schema"
import prisma from "../prisma.config";
import { Prisma } from "@prisma/client";
import { responseOk } from "../config/responses/app.response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";



// criando um objeto, com boas praticas
const commonUserService = {


    createCommonUser:  async (data: CommonUser) => {
        try {
             return await prisma.commonUser.create({data: data})
        }

        catch(e) {
            if(e instanceof Error) {
                console.log("Erro",  e.message)
                throw new Error(`Error: ${e.message} `)
            
            }

             if(e instanceof PrismaClientKnownRequestError) {
                console.log("Prisma Error", e.message)
                
                throw new Error(`Prisma Error: ${e.message}` )
            }
            
            console.log(e)
            throw new Error(`Erro inesperado: ${e}`)


        }
    }





}

export default commonUserService