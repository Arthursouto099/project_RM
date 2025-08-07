
export default class UserErrorHandler extends Error  {


    constructor(public readonly message: string,  public readonly code?: string, public readonly fault?: unknown ) {
        super(message)
        this.name = "UserErrorHandler"
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserErrorHandler);
        }
        
    }


    static validation(message = 'Erro de validação', fault?: unknown) {
        return new UserErrorHandler(message, 'VALIDATION_ERROR', fault);
    }

    // 💡 Erro de autenticação
    static unauthorized(message = 'Não autorizado') {
        return new UserErrorHandler(message, 'UNAUTHORIZED');
    }

    // 💡 Erro de permissão
    static forbidden(message = 'Acesso proibido') {
        return new UserErrorHandler(message, 'FORBIDDEN');
    }

    // 💡 Erro de recurso não encontrado
    static notFound(message = 'Recurso não encontrado') {
        return new UserErrorHandler(message, 'NOT_FOUND');
    }

    // 💡 Erro interno genérico
    static internal(message = 'Erro interno do servidor', fault?: unknown) {
        return new UserErrorHandler(message, 'INTERNAL_ERROR', fault)
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