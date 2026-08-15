import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

import { mastra } from "./mastra/index.js";

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) {
    return undefined;
  }
  return process.argv[index + 1];
}

const name = argValue("--name") ?? "Jane";
const email = argValue("--email") ?? "jane@example.com";

const workflow = mastra.getWorkflow("welcomeEmailWorkflow");
const run = await workflow.createRun();
const result = await run.start({
  inputData: { name, email },
});

if (result.status === "success") {
  console.log(JSON.stringify(result.result, null, 2));
  process.exit(0);
}

console.error(result.status === "failed" ? result.error : result);
process.exit(1);
