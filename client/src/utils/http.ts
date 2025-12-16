import type { ApiResponse } from "@shared/types/api-response";

async function http<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`/api/v1${path}`, {
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    ...init,
  });

  return response.json() as Promise<ApiResponse<T>>;
}

export default http;
