import { normalizeURL } from "@/app/_lib/normalize-url";
import { apiResponse } from "@/app/api/_lib/build-response";
import { analyzeArticle } from "./_lib/service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url: string };
    const url = body.url;

    if (!url) {
      return apiResponse({ message: "error", data: null }, 400);
    }

    const normalizedURL = normalizeURL(url);

    const data = await analyzeArticle(normalizedURL);

    return apiResponse({ message: "article analyzed", data });
  } catch (error) {
    console.error("error while processing article: ", error);
    return apiResponse({ message: "unable to process", data: null }, 500);
  }
}
