export function normalizeURL(input: string): string {
  const url = new URL(input);
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  const pathname = url.pathname.replace(/\/$/, "");
  return `${url.protocol}//${hostname}${pathname}`;
}
