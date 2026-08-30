import { NextRequest } from "next/server";
import { apiResponse } from "@/app/api/_lib/build-response";
import { getPreviewFilterMetadata } from "./_lib/service";

export async function GET(req: NextRequest) {
  try {
    const selectedSources = (req.nextUrl.searchParams.get("selected") ?? "")
      .split(",")
      .map((slug) => slug.trim())
      .filter(Boolean);
    const data = await getPreviewFilterMetadata(
      req.nextUrl.searchParams.get("q") ?? undefined,
      selectedSources,
    );

    return apiResponse({ message: "Preview filter options fetched!", data });
  } catch (error) {
    console.error("error while fetching preview filter options: ", error);
    return apiResponse({ message: "Unexpected Error", data: null }, 500);
  }
}
