import Anthropic from "@anthropic-ai/sdk";
import { Tool } from "@anthropic-ai/sdk/resources";
import fs from "fs/promises";
import path from "path";

function getToolForMode(mode: string): Tool {
  switch (mode) {
    case "summarize":
      return {
        name: "record_summary",
        description:
          "Record the summary, insights, and quotes for the article.",
        input_schema: {
          type: "object",
          properties: {
            tldr: {
              type: "string",
              description: "A single-sentence neutral summary.",
            },
            insights: {
              type: "array",
              items: { type: "string" },
              description: "Up to 6 key factual bullet points.",
            },
            quotes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  speaker: { type: "string" },
                  text: { type: "string" },
                },
                required: ["speaker", "text"],
              },
              description: "1 to 2 pivotal, exact quotes from key figures.",
            },
          },
          required: ["tldr", "insights", "quotes"],
        },
      };
    default:
      throw new Error(`Unsupported mode: ${mode}`);
  }
}

export async function anthropic(
  model: "claude-haiku-4-5" | "claude-sonnet-4-6",
  mode: "summarize" | "analyze" | "extract",
  userMsg: string,
) {
  const anth = new Anthropic();

  const systemPrompt = await fs.readFile(
    path.join(process.cwd(), "local", `${mode}.md`),
    "utf-8",
  );

  const tool = getToolForMode(mode);

  const msg = await anth.messages.create({
    model: model,
    max_tokens: 1000,
    system: systemPrompt,
    tools: [tool],
    tool_choice: { type: "tool", name: tool.name },
    messages: [
      {
        role: "user",
        content: userMsg,
      },
    ],
  });

  const meta = {
    model: msg.model,
    usage: msg.usage,
    dateGeneratedISO: new Date().toISOString(),
  };

  const toolBlock = msg.content.find((block) => block.type === "tool_use");
  const data = toolBlock?.type === "tool_use" ? toolBlock.input : null;

  console.log(data);

  return { data, meta };
}
