import { Ajv } from "ajv";
import { load } from "js-yaml";
import defaultSchema from "~/../schema.json";
import getConfigFile from "./location";
import type { Config } from "./types";
let loadedConfig: unknown;
try {
	loadedConfig = load(await (await getConfigFile()).text());
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
