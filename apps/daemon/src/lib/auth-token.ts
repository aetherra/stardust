import { randomBytes } from "node:crypto";
import { dump } from "js-yaml";
import { getConfig } from "./config/index";
import type { Config } from "./config/types.d.ts";

export default function generateToken() {
	const config = getConfig();
	if (config.token) {
		console.log("✨ Stardust: Config token already set");
		return config.token;
	}
	console.log("✨ Stardust: Token not set in configuration, generating...");
	const token = Buffer.from(randomBytes(32)).toString("hex");
	const writer = Bun.file(`${process.cwd()}/config.yml`).writer();
	const newConfig = dump({
		...config,
		token,
	} satisfies Config);
	writer.write(`${newConfig}\n`);
	writer.write("# yaml-language-server: $schema=schemaon");
	writer.end();
	console.log("✨ Stardust: Token generated: %s", token);
	return token;
}
