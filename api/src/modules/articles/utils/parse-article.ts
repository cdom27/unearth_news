import fetch from "node-fetch";
import nlp from "compromise";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

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

  console.log("keywords:", keywordArray.join(" ").toLowerCase());
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

  console.log("ARTICLE STUFF:", article);

  return {
    keywords: keywords,
    title: article.title,
    byline: article.byline,
    content: article.textContent,
    length: article.length,
    excerpt: article.excerpt,
  };
};

export default parseArticle;
