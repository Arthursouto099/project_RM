
import { Request, Response, NextFunction } from "express";




const GlobalErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if(error)  {
        console.log(error.message) 
        res.status(500).json({message: "Global 500 Error", success: false}) 
        return

    }
    next()    
}


export default GlobalErrorHandler