import { NextRequest } from "next/server";
import { apiResponse } from "@/app/api/_lib/build-response";
import { getSources } from "./_lib/service";

export async function GET(request: NextRequest) {
  try {
    const data = await getSources(request.nextUrl.searchParams);

    return apiResponse({ message: "Sources fetched!", data });
  } catch (error) {
    console.error("error while fetching sources: ", error);
    return apiResponse({ message: "Unexpected Error", data: null }, 500);
  }
}
