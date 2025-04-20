import { config } from "dotenv";
import { z } from "zod";

// .envファイルを読み込む
config();

// 環境変数のスキーマを定義
const envSchema = z.object({
  SLACK_APP_TOKEN: z.string(),
  SLACK_BOT_TOKEN: z.string(),
  AGENT_URL: z.string(),
});

// 環境変数を検証
export const env = envSchema.parse(process.env);
