import { execSync } from "node:child_process";
import { parseArgs } from "node:util";
import type { BunFile } from "bun";

async function iteratePaths(locations: string[]): Promise<BunFile | null> {
	for (const loc of locations) {
		const file = Bun.file(loc);
		if (await file.exists()) {
			console.log("✨ Stardust: Loaded config from %s", loc);
			return file;
		}
	}
	return null;
}

export default async function getConfigFile() {
	const {
		values: { config: cmdConfig = "" },
	} = parseArgs({
		args: Bun.argv,
		options: {
			config: {
				type: "string",
			},
		},
		strict: true,
		allowPositionals: true,
	});
	let repoRoot = "";
	try {
		repoRoot = execSync("git rev-parse --show-toplevel", { encoding: "utf-8" }).trim();
	} catch {}
	const configLocations = [
		cmdConfig,
		`${repoRoot}/daemon-config.yaml`,
		`${repoRoot}/daemon-config.yml`,
		`${Bun.env.HOME}/.config/stardustd.yaml`,
		`${Bun.env.HOME}/.config/stardustd.yml`,
	];

	const file = await iteratePaths(configLocations);

	if (!file) {
		console.error("✨ Stardust: Invalid or no config");
		process.exit(1);
	}

	return file;
}
