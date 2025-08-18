
import {Response} from "express";


export function responseOk(
  res: Response,
  message: string,
  data: unknown = null,
  code: number = 200,

) {
  return res.status(code).json({ message, code, data, requestTime: new Date().toISOString(), success: true});
}