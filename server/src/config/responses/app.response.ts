
import {Response} from "express";

export function responseOk(
  res: Response,
  message: string,
  data?: any,
  code: number = 200
) {
  return res.status(code).json({ message, code, data });
}