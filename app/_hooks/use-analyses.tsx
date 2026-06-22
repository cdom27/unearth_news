import { useCallback, useState } from "react";

export default function useAnalysis() {
  const [isFetching, setIsFetching] = useState(false);
  const [storiesResult, setStoriesResult] = useState(null);
  const [message, setMessage] = useState("");

  const fetchStories = useCallback(async () => {
    setIsFetching(true);

    try {
      const response = await fetch("/api/v1/articles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
    } catch {
      setMessage("An unexpected error has occurred");
      setStoriesResult(null);
    } finally {
      setIsFetching(false);
    }
  }, []);

  return {
    fetchStories,
    isFetching,
    storiesResult,
    message,
  };
}
