import { createTool } from "@mastra/core";
import { z } from "zod";
import { env } from "../../config/env";

export const tavilySearchTool = createTool({
  id: "tavily_search",
  description: "Tavilyを使用してWeb検索を行います。",
  inputSchema: z.object({
    query: z.string().describe("検索クエリ"),
  }),
  execute: async ({ context }) => {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query: context.query,
        search_depth: "basic",
        include_answer: true,
        include_raw_content: false,
        max_results: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  },
});
