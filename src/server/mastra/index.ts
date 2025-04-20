import { Mastra } from "@mastra/core";
import { recipeAgent } from "./agents/recipe_agent";

export const mastra = new Mastra({
  agents: {
    recipeAgent,
  },
});
