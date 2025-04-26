import { schema, TaskContext, TaskYieldUpdate } from "@ryukez/a2a-sdk";
import { ArtifactGraph, defineBuilder, UniqueArtifact } from "./artifact_graph";
import assert from "assert";

class Step1Artifact extends UniqueArtifact<"step1"> {
  constructor(artifact: schema.Artifact) {
    super("step1", artifact);
  }

  parsed(): number {
    if (this.artifact.parts[0].type !== "data") {
      throw new Error("Invalid artifact");
    }
    return this.artifact.parts[0].data.result as number;
  }
}

class Step2Artifact extends UniqueArtifact<"step2"> {
  constructor(artifact: schema.Artifact) {
    super("step2", artifact);
  }

  parsed(): number {
    if (this.artifact.parts[0].type !== "data") {
      throw new Error("Invalid artifact");
    }
    return this.artifact.parts[0].data.result as number;
  }
}

class Step3Artifact extends UniqueArtifact<"step3"> {
  constructor(artifact: schema.Artifact) {
    super("step3", artifact);
  }

  parsed(): number {
    if (this.artifact.parts[0].type !== "data") {
      throw new Error("Invalid artifact");
    }
    return this.artifact.parts[0].data.result as number;
  }
}

type Artifacts = [Step1Artifact, Step2Artifact, Step3Artifact];

const step1Builder = defineBuilder<Artifacts>()({
  inputs: () => [] as const,
  outputs: () => ["step1"] as const,
  async *build({ history }) {
    assert(history && history[0].parts[0].type === "text");
    const input = parseFloat(history[0].parts[0].text);

    if (Math.random() < 0.8) {
      throw new Error("step1でエラーが発生しました");
    }

    yield new Step1Artifact({
      parts: [{ type: "data", data: { result: input + 1 } }],
    });
  },
});

const step2Builder = defineBuilder<Artifacts>()({
  inputs: () => ["step1"] as const,
  outputs: () => ["step2"] as const,
  async *build({ inputs }) {
    if (Math.random() < 0.8) {
      throw new Error("step2でエラーが発生しました");
    }

    yield new Step2Artifact({
      parts: [
        {
          type: "data",
          data: { result: inputs.step1.parsed() * 2 },
        },
      ],
    });
  },
});

const step3Builder = defineBuilder<Artifacts>()({
  inputs: () => ["step2"] as const,
  outputs: () => ["step3"] as const,
  async *build({ inputs }) {
    if (Math.random() < 0.8) {
      throw new Error("step3でエラーが発生しました");
    }

    yield new Step3Artifact({
      parts: [
        {
          type: "data",
          data: { result: inputs.step2.parsed() + 10 },
        },
      ],
    });
  },
});

export async function* mathAgent({
  task,
  history,
}: TaskContext): AsyncGenerator<TaskYieldUpdate, schema.Task | void, unknown> {
  const graph = new ArtifactGraph<Artifacts>(
    {
      step1: (artifact) => new Step1Artifact(artifact),
      step2: (artifact) => new Step2Artifact(artifact),
      step3: (artifact) => new Step3Artifact(artifact),
    },
    [step1Builder, step2Builder, step3Builder]
  );

  for await (const update of graph.run(task, history)) {
    yield update;
  }
}

export const mathAgentCard: schema.AgentCard = {
  name: "Math Agent",
  description: "複数段階の計算を行い、80%の確率でエラーを返すエージェント",
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
      id: "multi_step_calculation",
      name: "Multi-step Calculation",
      description:
        "複数段階の計算を実行し、各ステップで80%の確率でエラーを返します",
      tags: ["math", "calculation", "error"],
      examples: [
        "5から始めて計算を実行してください",
        "10を入力値として計算を開始してください",
      ],
    },
  ],
};
