import UserErrorHandler from "./UserErrorHandler";

export default class PostErrorHandler extends UserErrorHandler {
       constructor(public readonly message: string,  public readonly code?: string, public readonly fault?: unknown, public readonly codeHttp: number = 500 ) {
        super(message)
        this.name = "PostErrorHandler"
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PostErrorHandler);
        }
        
    }

      static validation(message = 'Erro de validação', fault?: unknown) {
        return new PostErrorHandler(message, 'VALIDATION_ERROR', fault, 400);
    }

    // 💡 Erro de autenticação
    static unauthorized(message = 'Não autorizado', error?: unknown) {
        return new PostErrorHandler(message, 'UNAUTHORIZED', error, 401);
    }

    // 💡 Erro de permissão
    static forbidden(message = 'Acesso proibido', error?: unknown) {
        return new PostErrorHandler(message, 'FORBIDDEN', error, 401);
    }

    // 💡 Erro de recurso não encontrado
    static notFound(message = 'Recurso não encontrado', error?: unknown) {
        return new PostErrorHandler(message, 'NOT_FOUND', error, 404);
    }

    // 💡 Erro interno genérico
    static internal(message = 'Erro interno do servidor', fault?: unknown) {
        return new PostErrorHandler(message, 'INTERNAL_ERROR', fault, 500)
    }


}