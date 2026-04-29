import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";

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

  const msg = await anth.messages.create({
    model: model,
    max_tokens: 1000,
    system: systemPrompt,
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

  const firstBlock = msg.content[0];

  const response = firstBlock.type === "text" ? firstBlock.text : "";

  return { text: response, meta };
}
