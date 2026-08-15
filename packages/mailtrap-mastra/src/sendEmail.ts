import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import { getMailtrapClient } from "./mailtrap.js";
import { assertAllowedRecipient } from "./recipientPolicy.js";

export type CreateSendEmailToolOptions = {
  fromEmail?: string;
  fromName?: string;
};

function resolveFromEmail(options?: CreateSendEmailToolOptions): string {
  const fromEmail =
    options?.fromEmail ??
    process.env.DEFAULT_FROM_EMAIL ??
    process.env.MAILTRAP_FROM_EMAIL;

  if (!fromEmail) {
    throw new Error(
      "DEFAULT_FROM_EMAIL (or MAILTRAP_FROM_EMAIL) is not configured",
    );
  }

  return fromEmail;
}

export function createSendEmailTool(options?: CreateSendEmailToolOptions) {
  return createTool({
    id: "send-email",
    description:
      "Send a transactional email via Mailtrap. Use for welcome emails, notifications, etc.",
    inputSchema: z.object({
      to: z.string().email().describe("Recipient email address"),
      subject: z.string().min(1).describe("Email subject line"),
      text: z.string().optional().describe("Plain-text body"),
      html: z.string().optional().describe("HTML body"),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      messageId: z.string(),
      messageIds: z.array(z.string()),
    }),
    execute: async ({ to, subject, text, html }) => {
      assertAllowedRecipient(to);

      const fromEmail = resolveFromEmail(options);
      const client = getMailtrapClient();
      const response = await client.send({
        from: {
          email: fromEmail,
          name: options?.fromName ?? "Demo App",
        },
        to: [{ email: to }],
        subject,
        text: text ?? `Welcome! (subject: ${subject})`,
        html,
      });

      return {
        success: response.success,
        messageId: response.message_ids[0],
        messageIds: response.message_ids,
      };
    },
  });
}
