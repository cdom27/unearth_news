import type { ApiResponse } from "../lib/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function http<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    ...init,
  });

  return response.json() as Promise<ApiResponse<T>>;
}

export default http;
