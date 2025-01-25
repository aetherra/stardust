import ConfigEditor from "./editor";

export default async function Page() {
	const configFile = process.env.CONFIG as string;
	return (
		<div className="flex h-full flex-col">
			<ConfigEditor current={configFile} />
		</div>
	);
}
export const dynamic = "force-dynamic";
