import { Request, Response, NextFunction } from "express";
import { IUser } from "./models/user.models";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
