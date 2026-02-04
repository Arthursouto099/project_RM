
import { Request, Response, NextFunction } from "express";



import { ZodType } from "zod";


export const validate = (schema: ZodType<unknown>) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
        const errs = parsed.error.issues.map(issue => issue.message);
         res.status(400).json({
            message: errs[0],
            errors: errs, // lista apenas com as mensagens
            success: false,
        });
        return
    }

    next()
}