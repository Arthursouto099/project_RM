// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from "express"



declare global {
    namespace Express {
        interface Request {
            userLogged?: {
                id_user: string;
                email: string;
                cpf: string;
            };
        }
    }
}

export {}