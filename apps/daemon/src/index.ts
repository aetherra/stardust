import { existsSync as exists } from "node:fs"
import { getConfig, validateConfig } from "@/lib/config/index.js";
import { Elysia } from "elysia";
import doServiceCheck from "@/lib/serviceCheck.js";
const config = getConfig();
if (!validateConfig(config)) {
  console.error("Invalid configuration");
  process.exit(1);
}
const app = new Elysia()
  .get("/", () => ({
    message:
      "✨ Stardust daemon by spaceness \nSource tree: https://github.com/spaceness/stardust/tree/rewrite/apps/daemon",
    success: true,
  }))
  .listen({
    hostname: config.host,
    port: config.port || 4000,
  });

if (!exists("../NOSERVICE")) {
  doServiceCheck()
}

console.log(`✨ Stardust daemon is running at ${app.server?.hostname}:${app.server?.port}`);
