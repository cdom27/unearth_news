import { urlBlocklist } from "./static/url-blocklist";

export function normalizeURL(input: string): string | null {
  const url = new URL(input);

  if (
    urlBlocklist.some(
      (domain) =>
        url.hostname === domain || url.hostname.endsWith(`.${domain}`),
    )
  ) {
    return null;
  }

  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  const pathname = url.pathname.replace(/\/$/, "");
  return `${url.protocol}//${hostname}${pathname}`;
}
