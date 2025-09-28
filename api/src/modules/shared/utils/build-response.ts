import { Response } from "express";

export const success = <T>(
  res: Response,
  data: T,
  message = "Success",
  status = 200
) => {
  res.status(status).json({ status, message, data });
};

export const failure = (
  res: Response,
  message = "Internal server error",
  status = 500
) => {
  res.status(status).json({ status, message, data: null });
};
