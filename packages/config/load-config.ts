import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
const {
	values: { config: cmdConfig = "" },
} = parseArgs({
	args: process.argv,
	options: {
		config: {
			type: "string",
		},
	},
	strict: true,
	allowPositionals: true,
});
const configLocations = [
	cmdConfig,
	`${process.cwd()}/config.yaml`,
	`${process.cwd()}/config.yml`,
	`${process.env.XDG_CONFIG_HOME || process.env.HOME}/.config/stardust.yaml`,
	`${process.env.XDG_CONFIG_HOME || process.env.HOME}/.config/stardust.yml`,
];
for (const loc of configLocations) {
	if (existsSync(loc)) {
		console.log("✨ Stardust: Loaded config from %s", loc);
		process.env.CONFIG = await readFile(loc, "utf-8");
	}
}
