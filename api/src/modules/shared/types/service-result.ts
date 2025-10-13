export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; data?: T; error: E };
