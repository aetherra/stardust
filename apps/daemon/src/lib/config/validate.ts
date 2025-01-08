import { getConfig, validateConfig } from "@/lib/config/index.js";
if (!validateConfig(getConfig())) {
	console.error("Invalid configuration");
	process.exit(1);
}
