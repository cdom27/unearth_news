import { Response } from "express";
import type { ApiResponse } from "@shared/types/api-response";

export const success = <T>(
  res: Response,
  data: T,
  message = "Success",
  status = 200
) => {
  const response: ApiResponse<T> = { status, message, data };
  res.status(status).json(response);
};

export const failure = (
  res: Response,
  message = "Internal server error",
  status = 500
) => {
  const response: ApiResponse<null> = { status, message, data: null };
  res.status(status).json(response);
};
