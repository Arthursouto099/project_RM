import { fa } from "zod/v4/locales/index.cjs";
import UserErrorHandler from "./UserErrorHandler";

export default class  AuthErrorHandler extends UserErrorHandler {
    constructor(message: string, code?: string, fault?: unknown) {
        super(message, code, fault)
        this.name = "AuthErrorHandler"
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserErrorHandler);
        }
    }
}