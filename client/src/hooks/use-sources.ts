import { useCallback, useState } from "react";
import http from "../utils/http";
import type { SourceFilterDTO } from "@shared/dtos/source";

const useSources = () => {
  const [sourcesLoading, setSourcesLoading] = useState(false);
  const [sources, setSources] = useState<SourceFilterDTO[]>([]);

  const getUsedSources = useCallback(async () => {
    setSourcesLoading(true);
    try {
      const response = await http<SourceFilterDTO[]>(`/sources`, {
        method: "GET",
      });

      if (response.data) {
        console.log("data retrieved:", response.data);
        setSources(response.data);
      }
    } catch (error) {
      console.error("Error fetching sources:", error);
    } finally {
      setSourcesLoading(false);
    }
  }, []);

  return { sources, sourcesLoading, getUsedSources };
};

export default useSources;
