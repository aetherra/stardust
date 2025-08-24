import { readFileSync } from "node:fs";
import { getConfig, loadYaml } from "@stardust/config";
import { isEqual } from "lodash";
import ConfigEditor from "./editor";

export default async function Page() {
	const config = getConfig();
	const configPath = process.env.CONFIG_PATH as string;
	const file = readFileSync(configPath, "utf-8");
	const realFile = loadYaml(file);
	const restartEnabled = Boolean(getConfig().restartCommand);
	return (
		<ConfigEditor current={file} path={configPath} saved={isEqual(config, realFile)} restartEnabled={restartEnabled} />
	);
}
export const dynamic = "force-dynamic";
