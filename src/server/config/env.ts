import { config } from "dotenv";
import { z } from "zod";

// .envファイルを読み込む
config();

// 環境変数のスキーマを定義
const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  TAVILY_API_KEY: z.string().min(1),
});

// 環境変数を検証
export const env = envSchema.parse(process.env);
