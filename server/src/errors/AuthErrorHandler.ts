
import UserErrorHandler from "./UserErrorHandler";



export default class  AuthErrorHandler extends UserErrorHandler {
    constructor(message: string, code?: string, fault?: unknown, codeHttp: number = 500) {
        super(message, code, fault, codeHttp)
        this.name = "AuthErrorHandler"
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserErrorHandler);
        }
    }

    static validation(message = 'Erro de validação', fault?: unknown) {
        return new AuthErrorHandler(message, 'VALIDATION_ERROR', fault, 400);
    }

    // 💡 Erro de autenticação
    static unauthorized(message = 'Não autorizado', error?: unknown) {
        return new AuthErrorHandler(message, 'UNAUTHORIZED', error, 401 );
    }

    // 💡 Erro de permissão
    static forbidden(message = 'Acesso proibido', error?: unknown) {
        return new AuthErrorHandler(message, 'FORBIDDEN',  error, 401);
    }

    // 💡 Erro de recurso não encontrado
    static notFound(message = 'Recurso não encontrado', error?: unknown) {
        return new AuthErrorHandler(message, 'NOT_FOUND', error, 404);
    }

    // 💡 Erro interno genérico
    static internal(message = 'Erro interno do servidor', fault?: unknown) {
        return new AuthErrorHandler(message, 'INTERNAL_ERROR', fault)
    }
}