import { getConfig, validateConfig } from "@stardust/config";
const res = validateConfig(getConfig());
if (!res) {
	throw new Error("Config file schema invalid");
}
