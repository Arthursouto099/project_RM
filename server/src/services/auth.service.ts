import AuthErrorHandler from "../errors/AuthErrorHandler";
import prisma from "../prisma.config";
import { LoginUserInputs } from "../schemas/common_user.schema";
import * as bc from "bcrypt"
import { tokenConfig } from "../config/@tokenconfig/tokenConfig";



const authService = {

    login: async (inputs: LoginUserInputs) => {
        try {
            const userData = await prisma.commonUser.findUnique({ where: { email: inputs.email } })
            if (!userData) throw AuthErrorHandler.notFound("Não existe nenhum usuario com esse email")

            const checkPassword = await bc.compare(inputs.password, userData.password)
            if (!checkPassword) throw AuthErrorHandler.unauthorized("Senha incorreta")

            return tokenConfig.generateToken({ email: userData.email, cpf: userData.cpf, id_user: userData.id_user })

        }

        catch (e) {
            if (e instanceof AuthErrorHandler) {
                throw e;
            }

            console.error("Erro inesperado no login:", e);
            throw AuthErrorHandler.internal("Erro interno ao tentar realizar o login");
        }


    }


}


export default authService