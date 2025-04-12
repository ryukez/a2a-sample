# A2A Sample Implementation

このプロジェクトは、Agent-to-Agent（A2A）のサンプル実装です。レシピ提案エージェントを実装し、A2A SDKを使用してサーバーとして動作させます。

## プロジェクト構成

```
a2a-sample/
├── src/
│   ├── index.ts              # メインエントリーポイント
│   ├── mastra/
│   │   ├── agents/
│   │   │   └── recipe_agent.ts  # レシピ提案エージェントの実装
│   │   └── tools/
│   │       └── tavily_search.ts # Web検索ツールの実装
│   └── recipe_agent.ts       # a2aに準拠したagentのエントリポイントおよびカードの実装
|   └── cli.ts                # クライアント側のサンプル実装
├── package.json              # プロジェクト設定と依存関係
├── tsconfig.json             # TypeScript設定
└── .gitignore                # Git除外設定
```

## 機能

- レシピ提案エージェント
  - ユーザーの要望に応じたレシピの提案
  - Web検索によるレシピ情報の取得
  - レシピの詳細情報の提供

## 実行方法

### 前提条件

- Node.js (v18以上)
- npm

### セットアップ

1. リポジトリのクローン

```bash
git clone [repository-url]
cd a2a-sample
```

2. 依存関係のインストール

```bash
npm install
```

3. 環境変数の設定
   `.env`ファイルを作成し、必要な環境変数を設定します。

### サーバーの起動

1. 開発環境での実行

```bash
npm run dev
```

2. ビルドと実行

```bash
npm run build
npm start
```

デフォルトで`http://localhost:41241`でサーバーが起動します。

### CLIの実行

サーバーが起動した状態で、別のターミナルを開いて以下のコマンドを実行します：

```bash
npx ts-node src/cli.ts
```

```
A2A Terminal Client
Agent URL: http://localhost:41241
Attempting to fetch agent card from: http://localhost:41241/.well-known/agent.json
✓ Agent Card Found:
  Name:        Recipe Agent
  Description: An agent that suggests cooking recipes based on natural language instructions
  Version:     0.0.1
Starting Task ID: 438ccc1b-51e2-44b1-929c-769ca331f190
Enter messages, or use '/new' to start a new task.
Recipe Agent > You: カレー
Sending...

Recipe Agent [5:32:37 PM]: ⏳ Status: working
  Part 1: 📝 Text: レシピを検索中です...

Recipe Agent [5:32:38 PM]: 🤔 Status: input-required
  Part 1: 📝 Text: 次の候補の中から料理を選んでください: チキンカレー, 野菜カレー, ビーフカレー, シーフードカレー, キーマカレー
SSE stream finished for method tasks/sendSubscribe.
--- End of response for this input ---
Recipe Agent > You: チキンカレー
Sending...

Recipe Agent [5:33:11 PM]: ⏳ Status: working
  Part 1: 📝 Text: レシピを検索中です...

Recipe Agent [5:33:17 PM]: ✅ Status: completed
  Part 1: 📝 Text: 【チキンカレー】
【材料】（2人分）
- 鶏もも肉 300g
- 玉ねぎ 1個
- にんにく 1片
- 生姜 1片
- カレーパウダー 大さじ2
- トマト缶 1缶
- ココナッツミルク 200ml
- 塩 適量
- サラダ油 大さじ1
- パクチー（お好みで）

【手順】
1. 鶏もも肉は一口大に切り、塩をふって下味をつける。
2. 玉ねぎ、にんにく、生姜はみじん切りにする。
3. フライパンにサラダ油を熱し、玉ねぎを炒め、透明になるまで炒める。
4. にんにくと生姜を加え、香りが立つまで炒める。
5. 鶏肉を加え、表面が白くなるまで炒める。
6. カレーパウダーを加え、全体に絡める。
7. トマト缶とココナッツミルクを加え、煮立たせる。
8. 中火で15分ほど煮込み、塩で味を調える。
9. お好みでパクチーを散らして完成。

【コツ・ポイント】
- 鶏肉はしっかりと炒めることで、旨味が引き出されます。
- ココナッツミルクを加えることで、まろやかな味わいになります。
SSE stream finished for method tasks/sendSubscribe.
--- End of response for this input ---
```
