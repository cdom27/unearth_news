import {
  BlueprintIcon,
  CursorTextIcon,
  DatabaseIcon,
  DetectiveIcon,
  MagnifyingGlassIcon,
  ScalesIcon,
  TextColumnsIcon,
  UserCircleCheckIcon,
  UserFocusIcon,
} from "@phosphor-icons/react";

import DISCOVERY from "../assets/images/phases/discovery.svg";
import CONTEXTUALIZATION from "../assets/images/phases/context.svg";
import ANALYSIS from "../assets/images/phases/analysis.svg";

export const phases = [
  {
    id: 1,
    thumbnailSrc: DISCOVERY,
    thumbnailAlt: "Three characters teaming up with an idea and curiosity",
    heading: "Discovery",
    body: "Unearth starts by reading the same way you do—capturing content, identifying key themes, and mapping the language that drives the narrative.",
    steps: [
      {
        icon: CursorTextIcon,
        text: "Enter any topic (news article, reports)",
      },
      {
        icon: TextColumnsIcon,
        text: "Extract the raw content",
      },
      {
        icon: MagnifyingGlassIcon,
        text: "Apply NLP to analyze keywords",
      },
    ],
  },
  {
    id: 2,
    thumbnailSrc: CONTEXTUALIZATION,
    thumbnailAlt:
      "Two characters thinking deeply about the sparks in a lightbulb",
    heading: "Contextualization",
    body: "It then compares those signals across neutral databases and credible outlets, creating a bigger picture of how each story is told across the media landscape.",
    steps: [
      {
        icon: DatabaseIcon,
        text: "Gather data from non-partisan sources",
      },
      {
        icon: UserFocusIcon,
        text: "Identify other reports on the same topic",
      },
      {
        icon: BlueprintIcon,
        text: "Aggregate credibility and reliability data",
      },
    ],
  },
  {
    id: 3,
    thumbnailSrc: ANALYSIS,
    thumbnailAlt: "Two characters analyzing charts and graphs of their data",
    heading: "Analysis",
    body: "Finally, Unearth weighs sentiment, checks claims against verifiable sources, and flags potential misinformation—so your understanding is grounded in evidence, not noise.",
    steps: [
      {
        icon: ScalesIcon,
        text: "Evaluate sentiment and language",
      },
      {
        icon: UserCircleCheckIcon,
        text: "Fact check claims against data",
      },
      {
        icon: DetectiveIcon,
        text: "Detect misinformation and cite facts",
      },
    ],
  },
];
