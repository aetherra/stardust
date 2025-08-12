import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
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
	strict: false,
	allowPositionals: true,
});
const repoRoot = execSync("git rev-parse --show-toplevel", { encoding: "utf-8" }).trim();
const configLocations = [
	cmdConfig as string,
	`${repoRoot}/app-config.yaml`,
	`${repoRoot}/app-config.yml`,
	`${process.env.HOME}/.config/stardust.yaml`,
	`${process.env.HOME}/.config/stardust.yml`,
];
for (const loc of configLocations) {
	if (existsSync(loc)) {
		console.log("✨ Stardust: Loaded config from %s", loc);
		process.env.CONFIG = readFileSync(loc, "utf-8");
		process.env.CONFIG_PATH = loc;
		break;
	}
}
