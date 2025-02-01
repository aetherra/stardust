import { DataTable } from "@/components/ui/data-table";
import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";
import db from "@stardust/db";
import type { Metadata } from "next";
import { columns } from "./columns";
export const metadata: Metadata = {
	title: "Workspaces",
};
export default async function AdminPage() {
	const dbData = await db.query.workspace.findMany({
		with: {
			session: true,
		},
	});
	const nodeMetadata = await Promise.all(
		getConfig().nodes.map(async (n) => {
			const { data } = await stardustConnector(n).workspaces.index.get();
			if (!data) throw new Error("No node data");
			return {
				id: n.id,
				workspaces: data.workspaces.map((w) => w.RepoTags[0].split(":")[0]),
			};
		}),
	);
	const data = await Promise.all(
		dbData.map(async (d) => ({
			nodes: nodeMetadata.filter(({ workspaces }) => workspaces.includes(d.dockerImage)).map(({ id }) => id),
			...d,
		})),
	);
	return (
		<div className="flex h-full flex-col">
			<h1 className="py-6 text-3xl font-bold">Images</h1>
			<section className="-ml-8">
				<DataTable data={data} columns={columns} />
			</section>
		</div>
	);
}
