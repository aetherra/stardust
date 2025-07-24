import { DataTable } from "@/components/ui/data-table";
import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";
import type { Metadata } from "next";
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
		<div className="flex h-full flex-col">
			<h1 className="py-6 text-3xl font-bold">Nodes</h1>
			<section className="-ml-8">
				<DataTable data={data} columns={columns} />
			</section>
		</div>
	);
}
