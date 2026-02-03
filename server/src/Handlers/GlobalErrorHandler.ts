import { Request, Response, NextFunction } from "express";
import UserErrorHandler from "../errors/UserErrorHandler";
import AuthErrorHandler from "../errors/AuthErrorHandler";

const GlobalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error) {
    if (error instanceof AuthErrorHandler) {
      res.status(error.codeHttp).json(error.toJSON());
      return;
    }

    if (error instanceof UserErrorHandler) {
      res.status(error.codeHttp).json(error.toJSON());
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        message: error.message,
        stack: error.stack,
        resourseError: "ERROR_GLOBAL",
        url: req.url,
      });
    }

    res.status(500).json({ message: "Global 500 Error", success: false });
    return;
  }
  next();
};

export default GlobalErrorHandler;
