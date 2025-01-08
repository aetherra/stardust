import defaultSchema from "@/../schema.json";
import { Ajv } from "ajv";
import { load } from "js-yaml";
import type { Config } from "./types.d.ts";
let loadedConfig: unknown;
try {
	loadedConfig = load((await Bun.file(`${process.cwd()}/config.yml`).text()) || "");
} catch {
	console.log("Invalid or no config");
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
