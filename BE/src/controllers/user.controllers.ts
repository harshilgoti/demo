import { NextFunction, Request, Response } from "express";
import { IUser, User } from "../models/user.models";
import { ErrorResponse } from "../utils/ErrorResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/AppResponse";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cookieOptions } from "../constants";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password } = req.body;

    if ([fullName, email, password].some((field) => field?.trim() === "")) {
      throw new ErrorResponse(400, "All fields are required");
    }

    const existUser = await User.findOne({
      $or: [{ fullName, email }],
    });

    if (existUser) {
      throw new Error("User with email or username already exists");
    }

    const user = await User.create({
      fullName,
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select("-password");

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  }
);

export const generateToken = async (userId: mongoose.Types.ObjectId) => {
  try {
    const user = await User.findById({ _id: userId });

    const accessToken = await user?.generateAccessToken();
    const refreshToken = await user?.refreshAccessToken();

    if (!user) {
      throw new Error("User not found");
    }

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error(
      "Something went wrong while generating referesh and access token"
    );
  }
};

const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === "")) {
      throw new ErrorResponse(400, "All fields are required");
    }

    const user = await User.findOne({
      $or: [{ email }],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new Error("Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateToken(user._id);

    const loggedUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, loggedUser, "User login successfully"));
  }
);

const logOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req?.user?._id) {
      throw new Error("unauthorized ");
    }
    const { _id } = req.user;

    const user = await User.findByIdAndUpdate(
      _id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, {}, "User logout Successfully"));
  }
);

const refreshToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new Error("unauthorized request");
    }

    const decodeToken = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_SECRET as string
    );

    const user = await User.findById(incomingRefreshToken._id);

    if (!user) {
      throw new Error("Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new Error("Refresh token is expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "User registered Successfully"
        )
      );
  }
);

const getUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new Error("User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  }
);

export { getUserById, login, logOut, refreshToken, register };
