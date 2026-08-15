import { Mastra } from "@mastra/core/mastra";

import { sendEmailTool, welcomeEmailWorkflow } from "./workflows/welcomeEmail.js";

export const mastra = new Mastra({
  tools: { sendEmailTool },
  workflows: { welcomeEmailWorkflow },
});
