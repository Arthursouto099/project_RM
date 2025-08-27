import "express"



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