import ConfigEditor from "./editor";

export default async function Page() {
	const configFile = process.env.CONFIG as string;
	const configPath = process.env.CONFIG_PATH as string;
	return <ConfigEditor current={configFile} path={configPath} />;
}
export const dynamic = "force-dynamic";
