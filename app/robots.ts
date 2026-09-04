import type { MetadataRoute } from "next";

const blockedAgents = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "ClaudeBot",
  "anthropic-ai",
  "CCBot",
  "Bytespider",
  "PerplexityBot",
  "Amazonbot",
  "FacebookBot",
  "Meta-ExternalAgent",
  "Applebot-Extended",
  "Diffbot",
  "ImagesiftBot",
  "Omgili",
  "omgilibot",
  "Scrapy",
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "PetalBot",
  "DataForSeoBot",
  "Barkrowler",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/", "/*?*"],
      },
      ...blockedAgents.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
    ],
  };
}
