import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";
import type { Metadata } from "next";
import DataRefresh from "@/components/data-refresh";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
export const metadata: Metadata = {
	title: "Nodes",
};
export default async function Page() {
	const data = await Promise.all(
		getConfig().nodes.map(async (n) => {
			const node = stardustConnector(n);
			return {
				...n,
				health: (await node.healthcheck.get()).data,
				sessions: (await node.sessions.list.get()).data?.containers,
				workspaces: (await node.workspaces.index.get()).data?.workspaces,
			};
		}),
	);
	return (
		<>
			<h1 className="py-6 text-3xl font-bold">Nodes</h1>
			<section className="-ml-4 sm:-ml-8">
				<DataTable data={data} columns={columns} />
			</section>
			<DataRefresh />
		</>
	);
}
