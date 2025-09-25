import { Request, Response } from "express";
import { success, failure } from "../shared/utils/buildResponse";

export const analyze = async (
  req: Request<{}, {}, { url: string }>,
  res: Response
) => {
  try {
    // parse and validate request body
    const { url } = req.body;

    if (!url) {
      return failure(res, "Request body is missing", 400);
    }

    return success(
      res,
      { id: "xyz456", requestUrl: url },
      "Successfully analyzed url"
    );
  } catch (error) {
    console.log("Error generating:", error);
    return failure(res, "Internal error while generating");
  }
};
