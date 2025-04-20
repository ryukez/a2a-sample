import { recipeAgent, recipeAgentCard } from "./recipe_agent";
import { A2AServer } from "a2a-sdk-ryukez";

const server = new A2AServer(recipeAgent, {
  card: recipeAgentCard,
});

server.start(); // Default port 41241

console.log("[RecipeAgent] Server started on http://localhost:41241");
console.log("[RecipeAgent] Press Ctrl+C to stop the server");
