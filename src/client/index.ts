import { App } from "@slack/bolt";
import dotenv from "dotenv";
import { env } from "./config/env";
import { defaultSlackMessageChannel } from "a2a-sdk-ryukez/client/slack";

// 環境変数の読み込み
dotenv.config();

// Slackアプリの初期化
const app = new App({
  token: env.SLACK_BOT_TOKEN,
  appToken: env.SLACK_APP_TOKEN,
  socketMode: true,
});

const agentMessageChannel = defaultSlackMessageChannel(env.AGENT_URL, app);

// メンションに対する応答
app.event("app_mention", async ({ event }) => {
  const threadTs = event.thread_ts || event.ts;

  agentMessageChannel.userMessage({
    taskId: threadTs,
    sessionId: threadTs,
    text: event.text,
    context: { channel: event.channel, threadTs },
  });
});

// アプリの起動
(async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();
