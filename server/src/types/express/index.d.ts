// eslint-disable-next-line @typescript-eslint/no-unused-vars
import 'express';

declare module 'express' {
    interface Request {
        userLogged?: {
            id_user: string;
            email: string;
            cpf: string;
            name: string
        };
    }
}