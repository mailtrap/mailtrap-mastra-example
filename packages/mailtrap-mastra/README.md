# @mailtrap/mastra

Official [Mastra](https://mastra.ai) tools for sending transactional emails via [Mailtrap](https://mailtrap.io).

## Installation

```bash
yarn add @mailtrap/mastra

# or npm
npm install @mailtrap/mastra
```

Peer dependencies: `@mastra/core`, `zod`.

## Usage

```ts
import { createSendEmailTool } from "@mailtrap/mastra";
import { Mastra } from "@mastra/core/mastra";

const sendEmailTool = createSendEmailTool();

export const mastra = new Mastra({
  tools: { sendEmailTool },
});
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `MAILTRAP_API_TOKEN` | Yes | Mailtrap API token |
| `DEFAULT_FROM_EMAIL` | Yes* | Sender on a verified domain (*or `MAILTRAP_FROM_EMAIL`) |
| `MAILTRAP_FROM_EMAIL` | No | Alias for `DEFAULT_FROM_EMAIL` |
| `ALLOWED_RECIPIENT_EMAIL` | No | Extra allowed recipient besides `@example.com` |
| `MAILTRAP_ACCOUNT_ID` | No | Passed through to `MailtrapClient` |
