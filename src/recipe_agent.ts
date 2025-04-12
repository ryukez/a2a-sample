import { mastra } from "./mastra";
import { schema, TaskContext, TaskYieldUpdate } from "a2a-sdk-ryukez";
import { CoreMessage } from "@mastra/core";
import { z } from "zod";

export async function* recipeAgent({
  task,
  history,
}: TaskContext): AsyncGenerator<TaskYieldUpdate, schema.Task | void, unknown> {
  console.log(`task: ${JSON.stringify(task)}`);
  console.log(`history: ${JSON.stringify(history)}`);

  yield {
    state: "working",
    message: {
      role: "agent",
      parts: [{ type: "text", text: "レシピを検索中です..." }],
    },
  };

  try {
    const agent = mastra.getAgent("recipeAgent");

    const messages: CoreMessage[] = (history ?? []).flatMap((m) =>
      m.parts
        .filter((p): p is schema.TextPart => !!(p as schema.TextPart).text)
        .map((p) => {
          return {
            role: m.role === "agent" ? "assistant" : "user",
            content: p.text,
          };
        })
    );

    const response = await agent.generate(messages, {
      output: z.object({
        response_type: z.enum(["recipe_list", "recipe_detail"]),
        list: z.array(z.string()).optional(),
        recipe: z.string().optional(),
      }),
    });

    switch (response.object.response_type) {
      case "recipe_list":
        yield {
          state: "input-required",
          message: {
            role: "agent",
            parts: [
              {
                type: "text",
                text: `次の候補の中から料理を選んでください: ${(response.object.list ?? []).join(", ")}`,
              },
            ],
          },
        };
        break;
      case "recipe_detail":
        yield {
          state: "completed",
          message: {
            role: "agent",
            parts: [{ type: "text", text: response.object.recipe ?? "" }],
          },
        };
        break;
      default:
        throw new Error("Invalid response type");
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
    yield {
      state: "failed",
      message: {
        role: "agent",
        parts: [
          { type: "text", text: "レシピの検索中にエラーが発生しました。" },
        ],
      },
    };
  }
}

export const recipeAgentCard: schema.AgentCard = {
  name: "Recipe Agent",
  description:
    "An agent that suggests cooking recipes based on natural language instructions",
  url: "http://localhost:41241",
  version: "0.0.1",
  capabilities: {
    streaming: true,
    pushNotifications: false,
    stateTransitionHistory: true,
  },
  authentication: null,
  defaultInputModes: ["text"],
  defaultOutputModes: ["text"],
  skills: [
    {
      id: "recipe_suggestion",
      name: "Recipe Suggestion",
      description:
        "Suggests cooking recipes based on user requests, streaming the results.",
      tags: ["cooking", "recipe", "food"],
      examples: [
        "I want to cook a pasta dish",
        "Tell me a recipe for a pasta dish, using ingredients of chicken and tomato",
      ],
    },
  ],
};
