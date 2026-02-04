import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";
import { responseOk } from "../config/responses/app.response";

const auhtController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await authService.login(req.body);

      res.cookie("cookie_token", token, {
        httpOnly: true,
        // secure: isProd,
        // sameSite: isProd ? 'none' : 'lax',
        maxAge: 60 * 60 * 1000,
        path: "/",
      });

      responseOk(res, "Usuario logado com sucesso", 200);
    } catch (e) {
      next(e);
    }
  },
};

export default auhtController;
