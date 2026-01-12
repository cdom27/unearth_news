import { useCallback, useState } from "react";
import http from "../utils/http";
import type {
  SourceDTO,
  SourceFilterDTO,
  SourceRatingPreviewDTO,
} from "@shared/dtos/source";
import type { PaginationInfo } from "@shared/types/pagination-info";

const useSources = () => {
  const [sourcesLoading, setSourcesLoading] = useState(false);
  const [sources, setSources] = useState<SourceFilterDTO[]>([]);
  const [source, setSource] = useState<SourceDTO | null>(null);
  const [previewsLoading, setPreviewsLoading] = useState(false);
  const [previews, setPreviews] = useState<SourceRatingPreviewDTO[]>([]);
  const [isSourceLoading, setIsSourceLoading] = useState(false);

  // Fetch source every source uniquely referenced by an article
  const getUsedSources = useCallback(async () => {
    setSourcesLoading(true);
    try {
      const response = await http<SourceFilterDTO[]>(`/sources`, {
        method: "GET",
      });

      if (response.data) {
        setSources(response.data);
      }
    } catch (error) {
      console.error("Error fetching sources:", error);
    } finally {
      setSourcesLoading(false);
    }
  }, []);

  // Fetch full data of a source
  const getSourceDetails = useCallback(async (slug: string) => {
    setSource(null);
    setIsSourceLoading(true);

    try {
      const response = await http<SourceDTO>(`/sources/${slug}`, {
        method: "GET",
      });

      if (response.data) {
        setSource(response.data);
      }
    } catch (error) {
      console.error("Error fetching source details", error);
      setSource(null);
    } finally {
      setIsSourceLoading(false);
    }
  }, []);

  // Fetch source preview data for media-rating pages
  const getSourcePreviews = useCallback(
    async (params?: {
      page?: string;
      pageSize?: string;
      bias?: string[];
      sort?: string;
    }) => {
      setPreviewsLoading(true);

      try {
        const queryParams = new URLSearchParams();

        const page = params?.page || "1";
        const pageSize = params?.pageSize || "50";
        const sort = params?.sort || "name_asc";

        queryParams.append("page", page);
        queryParams.append("pageSize", pageSize);
        queryParams.append("sort", sort);

        if (params?.bias && params.bias.length > 0) {
          queryParams.append("bias", params.bias.join(","));
        }

        const queryString = queryParams.toString();
        const url = `/sources/ratings?${queryString}`;

        const response = await http<{
          paginationInfo: PaginationInfo;
          previews: SourceRatingPreviewDTO[];
        }>(url, { method: "GET" });

        if (response.data) {
          console.log("Source rating preview res:", response.data);
          setPreviews(response.data.previews);
        } else {
          setPreviews([]);
        }
      } catch (error) {
        console.error("Error fetching sources:", error);
      } finally {
        setPreviewsLoading(false);
      }
    },
    [],
  );

  return {
    sources,
    sourcesLoading,
    getUsedSources,
    getSourcePreviews,
    getSourceDetails,
    source,
    isSourceLoading,
    previews,
    previewsLoading,
  };
};

export default useSources;
