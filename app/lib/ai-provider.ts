import OpenAI from "openai";
import { usePuterStore } from "./puter";

let useOpenAI = true; // Toggle this to switch providers

const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = openaiKey
  ? new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true })
  : null;

export function useAIProvider() {
  const puterStore = usePuterStore();

  async function chat(prompt: string) {
    if (useOpenAI && openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
        });
        return {
          message: {
            content: response.choices[0]?.message?.content || "",
          },
        };
      } catch (error) {
        console.error("OpenAI error, falling back to Puter:", error);
      }
    }
    // Default to Puter
    return puterStore.ai.chat(prompt);
  }

  return { chat };
}