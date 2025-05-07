import { NextFunction, Request, Response } from "express"; // Added Response import here
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/user.models";
import { generateToken } from "../controllers/user.controllers";
import mongoose from "mongoose";
import { cookieOptions } from "../constants";

export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export const verifyJWT = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!accessToken) {
        throw new Error("Unauthorized request");
      }

      try {
        const decodedToken = jwt.verify(
          accessToken,
          process.env.JWT_SECRET as string
        ) as {
          _id: string;
          email?: string;
        };

        const user = await User.findById(decodedToken._id).select(
          "-password -refreshToken"
        );

        if (!user) {
          throw new Error("Invalid Access Token");
        }

        req.user = user;
        next();
      } catch (error) {
        if (
          error instanceof jwt.TokenExpiredError &&
          req.cookies?.refreshToken
        ) {
          const refreshToken = req.cookies.refreshToken;

          try {
            const decodedRefreshToken = jwt.verify(
              refreshToken,
              process.env.JWT_SECRET as string
            ) as {
              _id: string;
            };

            const user = await User.findOne({
              _id: decodedRefreshToken._id,
              refreshToken: refreshToken,
            });

            if (!user) {
              throw new Error("Invalid Refresh Token");
            }

            const userId = new mongoose.Types.ObjectId(user._id);
            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = await generateToken(userId);

            res.cookie("accessToken", newAccessToken, cookieOptions);
            res.cookie("refreshToken", newRefreshToken, cookieOptions);

            req.user = user;
            next();
          } catch (refreshError) {
            throw new Error("Invalid or expired refresh token");
          }
        } else {
          throw new Error("Access token is invalid");
        }
      }
    } catch (error) {
      next(error);
    }
  }
);
