import * as express from "express"

export type CustomRequest = express.Request & {
    userLogged?: {
        id_user: string;
        email: string;
        cpf: string;
        name: string
    };
}

