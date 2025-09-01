
export default class UserErrorHandler extends Error  {


    constructor(public readonly message: string,  public readonly code?: string, public readonly fault?: unknown, public readonly codeHttp: number = 500 ) {
        super(message)
        this.name = "UserErrorHandler"
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserErrorHandler);
        }
        
    }


    static validation(message = 'Erro de validação', fault?: unknown) {
        return new UserErrorHandler(message, 'VALIDATION_ERROR', fault, 400);
    }

    // 💡 Erro de autenticação
    static unauthorized(message = 'Não autorizado', error?: unknown) {
        return new UserErrorHandler(message, 'UNAUTHORIZED', error, 401);
    }

    // 💡 Erro de permissão
    static forbidden(message = 'Acesso proibido', error?: unknown) {
        return new UserErrorHandler(message, 'FORBIDDEN', error, 401);
    }

    // 💡 Erro de recurso não encontrado
    static notFound(message = 'Recurso não encontrado', error?: unknown) {
        return new UserErrorHandler(message, 'NOT_FOUND', error, 404);
    }

    // 💡 Erro interno genérico
    static internal(message = 'Erro interno do servidor', fault?: unknown) {
        return new UserErrorHandler(message, 'INTERNAL_ERROR', fault, 500)
    }


    toJSON() {
        return {
            error: this.name,
            message: this.message,
            code: this.code,
            fault: this.fault,
        };
    }












}