import { Request, Response } from "express";
import { failure, success } from "../shared/utils/build-response";
import { findUsedSources } from "./service";

export const getSourcesHandler = async (req: Request, res: Response) => {
  try {
    // future: params for pagination and filtered query - not needed yet
    const result = await findUsedSources();
    return success(res, result.data, "Successfully found sources");
  } catch (error) {
    console.error("Error while fetching sources:", error);
    return failure(res, "Internal error while fetching sources");
  }
};
