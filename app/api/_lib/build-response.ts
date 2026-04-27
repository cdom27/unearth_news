export type ApiResponse<T = null> = {
  message: string;
  data: T | null;
};

export function apiResponse<T = null>(
  body: ApiResponse<T>,
  status: number = 200,
): Response {
  return Response.json(body, { status });
}
