import { Ajv } from "ajv";
import { load } from "js-yaml";
import type { Config } from "./config.d.ts";
import defaultSchema from "./schema.json";
export function getConfig<T = Config>(): T {
	return load(process.env.CONFIG as string) as T;
}
export function validateConfig(config: unknown, sch?: unknown) {
	const validate = new Ajv().compile(sch || defaultSchema);
	const res = validate(typeof config === "string" ? load(config) : config);
	return res;
}
