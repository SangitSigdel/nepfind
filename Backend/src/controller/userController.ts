import { NextFunction, Request, Response } from "express";

import UserModel from "../model/chatModel";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = await UserModel.create(req.body);
    res.status(200).send({
      status: "success",
      data: newUser,
    });
  } catch (error) {
    res.status(400).send({
      message: error,
    });
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findOne({ user_id: req.params.id });

    res.status(200).send({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      message: error,
    });
  }
};

export const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findOne({ user_id: req.params.id });

    if (user) {
      user.online = true;
      user.save();
      res.status(200).send({
        status: "success",
        online: user.online,
      });
    } else {
      res.status(404).send({
        status: "failed",
        message: "sorry user not found",
      });
    }
  } catch (error) {
    res.status(400).send({
      message: error,
    });
  }
};
