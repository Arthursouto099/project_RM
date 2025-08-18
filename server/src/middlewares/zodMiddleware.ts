
import { Request, Response, NextFunction } from "express";



import {   ZodType } from "zod";


export const validate = (schema: ZodType<unknown>) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)
    if(!parsed.success) {
        const errs = parsed.error
        console.error(errs.message)
        res.status(404).json({message: "Dados inválidos", error: errs.issues, success: false, })
        return
    }

    next()
}