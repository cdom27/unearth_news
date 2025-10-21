import MBFC from "../assets/images/data-sources/mbfc.svg";
import ADFONTES from "../assets/images/data-sources/ad-fontes.png";
import ALLSIDES from "../assets/images/data-sources/all-sides.svg";
import NEWSGUARD from "../assets/images/data-sources/news-guard.svg";
import PEWRESEARCH from "../assets/images/data-sources/pew.svg";

export const sources = [
  {
    id: "media-bias-fact-check",
    thumbnailSrc: MBFC,
    heading: "Media Bias / Fact Check",
    body: "Independent ratings reveal how sources lean and how factual their reporting is. You’ll see the context behind every claim—clear, calm, and free of spin.",
    linkLabel: "How we use this data",
  },
  {
    id: "ad-fontes-media",
    thumbnailSrc: ADFONTES,
    heading: "Ad Fontes Media",
    body: "Rigorous analysis maps where outlets fall on the bias and reliability spectrum. The result: a fair view of the media landscape that helps you think, not take sides.",
    linkLabel: "Our source methodology",
  },
  {
    id: "all-sides",
    thumbnailSrc: ALLSIDES,
    heading: "AllSides",
    body: "Crowdsourced insights show how the same story reads from different perspectives. It’s a window into how others see the world—and how balance really looks in practice.",
    linkLabel: "How we balance insights",
  },
  {
    id: "news-guard",
    thumbnailSrc: NEWSGUARD,
    heading: "NewsGuard",
    body: "Expert reviewers apply transparent journalistic criteria to each outlet. Their “nutrition-style” ratings help you understand credibility at a glance.",
    linkLabel: "Our credibility methods",
  },
  {
    id: "pew-research-center",
    thumbnailSrc: PEWRESEARCH,
    heading: "Pew Research Center",
    body: "Decades of trusted research reveal how audiences interact with news and truth. That context helps you see not just what’s accurate, but why it matters.",
    linkLabel: "Our research partners",
  },
];
