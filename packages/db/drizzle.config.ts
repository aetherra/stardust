import "@stardust/config/load-config";
import { getConfig } from "@stardust/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
	dialect: "postgresql",
	schema: "./schema/index.ts",
	out: ".",
	dbCredentials: {
		url: getConfig().databaseUrl,
	},
});
