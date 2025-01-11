import { parseArgs } from "node:util";
import { Ajv } from "ajv";
import { load } from "js-yaml";
import defaultSchema from "~/../schema.json";
import type { Config } from "./types";
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
let loadedConfig: unknown;
try {
	for (const path of [
		cmdConfig,
		`${process.cwd()}/config.yaml`,
		`${process.cwd()}/config.yml`,
		`${Bun.env.XDG_CONFIG_HOME || Bun.env.HOME}/.config/stardustd.yaml`,
		`${Bun.env.XDG_CONFIG_HOME || Bun.env.HOME}/.config/stardustd.yml`,
	]) {
		const file = Bun.file(path);
		if (await file.exists()) {
			loadedConfig = load(await file.text());
			console.log("✨ Stardust: Loaded config from %s", path);
			break;
		}
	}
	if (!loadedConfig) {
		throw new Error("Config file not found");
	}
} catch (e) {
	console.error("✨ Stardust: Invalid or no config", e);
	process.exit(1);
}
export function getConfig<T = Config>(): T {
	return loadedConfig as T;
}
export function validateConfig(config: unknown) {
	const validate = new Ajv().compile(defaultSchema);
	const res = validate(config);
	return res;
}
