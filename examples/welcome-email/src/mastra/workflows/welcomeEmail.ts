import { createSendEmailTool } from "@mailtrap/mastra";
import { createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

export const sendEmailTool = createSendEmailTool();

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
