import fetch from "node-fetch";
import nlp from "compromise";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { ParsedArticle } from "../types/parsed-article";

// Extract the html from a article url
const extractArticleHtml = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return await response.text();
};

// Use nlp to extract nouns from article title
const extractKeywords = (title: string) => {
  const doc = nlp(title);

  let nouns: string[] = doc.nouns().out("array");
  nouns = nouns.filter((w) => !/^(he|she|they|it|we|I)$/i.test(w));

  const keywordArray = Array.from(new Set([...nouns]));
  return keywordArray.join(" ").toLowerCase();
};

// Gather all metadata for an article
const parseArticle = async (url: string) => {
  const html = await extractArticleHtml(url);
  const dom = new JSDOM(html, { url });

  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) {
    return null;
  }

  const keywords = extractKeywords(article.title!);
  const parsedArticle: ParsedArticle = {
    sourceName: article.siteName ?? "",
    url: url,
    title: article.title ?? "",
    byline: article.byline ?? "",
    excerpt: article.excerpt ?? "",
    language: article.lang ?? "",
    textContent: article.textContent ?? "",
    htmlContent: article.content ?? "",
    publishedTime: new Date(article.publishedTime ?? Date.now()),
  };

  return parsedArticle;
};

export default parseArticle;
