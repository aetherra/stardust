import defaultSchema from "@/../schema.json";
import { Ajv } from "ajv";
import { load } from "js-yaml";
import type { Config } from "./types.d.ts";
const loadedConfig = load(await Bun.file(`${process.cwd()}/config.yml`).text());
export function getConfig<T = Config>(): T {
	return loadedConfig as T;
}
export function validateConfig(config: unknown) {
	const validate = new Ajv().compile(defaultSchema);
	const res = validate(config);
	return res;
}
