import UserErrorHandler from "./UserErrorHandler";

export default class ChatErrorHandler extends UserErrorHandler {
       constructor(public readonly message: string,  public readonly code?: string, public readonly fault?: unknown, public readonly codeHttp: number = 500 ) {
        super(message)
        this.name = "ChatErrorHandler"
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ChatErrorHandler);
        }
        
    }

      static validation(message = 'Erro de validação', fault?: unknown) {
        return new ChatErrorHandler(message, 'VALIDATION_ERROR', fault, 400);
    }

    // 💡 Erro de autenticação
    static unauthorized(message = 'Não autorizado', error?: unknown) {
        return new ChatErrorHandler(message, 'UNAUTHORIZED', error, 401);
    }

    // 💡 Erro de permissão
    static forbidden(message = 'Acesso proibido', error?: unknown) {
        return new ChatErrorHandler(message, 'FORBIDDEN', error, 401);
    }

    // 💡 Erro de recurso não encontrado
    static notFound(message = 'Recurso não encontrado', error?: unknown) {
        return new ChatErrorHandler(message, 'NOT_FOUND', error, 404);
    }

    // 💡 Erro interno genérico
    static internal(message = 'Erro interno do servidor', fault?: unknown) {
        return new ChatErrorHandler(message, 'INTERNAL_ERROR', fault, 500)
    }


}