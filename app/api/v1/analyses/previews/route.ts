import { NextRequest } from "next/server";
import { getAnalysesPreviews } from "./_lib/service";
import { apiResponse } from "@/app/api/_lib/build-response";

export async function GET(req: NextRequest) {
  try {
    const result = await getAnalysesPreviews(req.nextUrl.searchParams);

    return apiResponse({
      message: "Previews fetched!",
      data: result,
    });
  } catch (error) {
    console.error("error while fetching previews: ", error);
    return apiResponse({ message: "Unexpected Error", data: null }, 500);
  }
}
