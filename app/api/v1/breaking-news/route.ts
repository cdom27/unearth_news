import { apiResponse } from "../../_lib/build-response";
import { fetchBreakingNews } from "./_lib/service";

export async function GET() {
  try {
    // Fetch up to 200 articles (2 pages of 100 each)
    const newsAPIResponse = await fetchBreakingNews(200);

    if (!newsAPIResponse.success) {
      return apiResponse({
        message: newsAPIResponse.error,
        data: null,
      });
    }

    return apiResponse({
      message: "Results fetched!",
      data: newsAPIResponse.data,
    });
  } catch (error) {
    console.error("Error while fetching breaking news: ", error);
    return apiResponse({
      message: "Unexpected error while fetching breaking news",
      data: null,
    });
  }
}
