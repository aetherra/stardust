import { Ajv } from "ajv";
import { load } from "js-yaml";
import type { Config } from "./config.d.ts";
import schema from "./schema.json";
const loadedConfig = load(process.env.CONFIG as string);
export function getConfig(): Config {
	return loadedConfig as Config;
}
export function validateConfig(config: unknown) {
	const validate = new Ajv().compile(schema);
	const res = validate(config);
	return res;
}
