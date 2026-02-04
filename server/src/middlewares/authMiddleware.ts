import { Response, NextFunction } from "express";
import { tokenConfig } from "../config/@tokenconfig/tokenConfig";
import { Payload } from "../config/@tokenconfig/tokenConfig";
import { CustomRequest } from "../types/CustomRequest";


export default function authMiddleware(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const cookie = req.cookies?.cookie_token;

  // trocar para um erro mais especializado
  if (!cookie) {
    res.status(401).json({ message: "Não autorizado" });
    return;
  }

  let loader: Payload |  null = null;

  try {
    loader = tokenConfig.verifyToken(cookie) as Payload;
  } catch {
    res.status(401).json({ message: "Não autorizado" });
  }

  if (!loader) {
    res.status(401).json({ message: "Não autorizado" });
    return;
  }

  req.userLogged = {
    email: loader.email,
    cpf: loader.cpf,
    id_user: loader.id_user,
    name: loader.name,
  };

  next();
}
