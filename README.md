# Mailtrap Mastra

Official [Mastra](https://mastra.ai) tools for sending transactional emails via [Mailtrap](https://mailtrap.io).

Install `@mailtrap/mastra` and register `createSendEmailTool()` with a Mastra instance. This repo also includes a short welcome-email workflow example.

## Prerequisites

1. [Create a Mailtrap account](https://mailtrap.io/signup)
2. [Verify your domain](https://docs.mailtrap.io/email-api-smtp/setup/sending-domain)
3. Get your API token from [Mailtrap API tokens](https://mailtrap.io/settings/api-tokens)

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

### Tool definition

```ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export function createSendEmailTool(options?: {
  fromEmail?: string;
  fromName?: string;
}) {
  return createTool({
    id: "send-email",
    description:
      "Send a transactional email via Mailtrap. Use for welcome emails, notifications, etc.",
    inputSchema: z.object({
      to: z.string().email(),
      subject: z.string().min(1),
      text: z.string().optional(),
      html: z.string().optional(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      messageId: z.string(),
      messageIds: z.array(z.string()),
    }),
    execute: async ({ to, subject, text, html }) => {
      // MailtrapClient.send(...) → { success, messageId, messageIds }
    },
  });
}
```

### Workflow

A workflow can take `{ name, email }`, map that to the tool input, and call `sendEmailTool`:

```ts
import { createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

export const welcomeEmailWorkflow = createWorkflow({
  id: "welcome-email",
  inputSchema: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    messageId: z.string(),
    messageIds: z.array(z.string()),
  }),
})
  .map(async ({ inputData }) => ({
    to: inputData.email,
    subject: `Welcome, ${inputData.name}`,
    text: `Hi ${inputData.name},\n\nWelcome! Thanks for signing up.`,
  }))
  .tool(sendEmailTool)
  .commit();
```

Register both on the Mastra instance:

```ts
export const mastra = new Mastra({
  tools: { sendEmailTool },
  workflows: { welcomeEmailWorkflow },
});
```

## Example

```bash
cp examples/welcome-email/.env.example examples/welcome-email/.env.local
# Fill in MAILTRAP_API_TOKEN and DEFAULT_FROM_EMAIL

yarn install
yarn build
yarn start --name Jane --email jane@example.com
```

Expected result:

```json
{
  "success": true,
  "messageId": "0c7fd939-02cf-11ed-88c2-0a58a9feac02",
  "messageIds": ["0c7fd939-02cf-11ed-88c2-0a58a9feac02"]
}
```

Demo recipients are limited to `@example.com` or the optional `ALLOWED_RECIPIENT_EMAIL` address.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `MAILTRAP_API_TOKEN` | Yes | Mailtrap API token |
| `DEFAULT_FROM_EMAIL` | Yes* | Sender address on a verified domain (*or `MAILTRAP_FROM_EMAIL`) |
| `MAILTRAP_FROM_EMAIL` | No | Alias for `DEFAULT_FROM_EMAIL` |
| `ALLOWED_RECIPIENT_EMAIL` | No | Extra allowed recipient besides `@example.com` |
| `MAILTRAP_ACCOUNT_ID` | No | Passed through to the SDK client |

## License

MIT — see [LICENSE.txt](LICENSE.txt).
