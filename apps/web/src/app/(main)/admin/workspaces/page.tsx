import { DataTable } from "@/components/ui/data-table";
import { getNodeWorkspaces } from "@/lib/workspaces";
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
	const nodeMetadata = await getNodeWorkspaces();
	const data = await Promise.all(
		dbData.map(async (d) => ({
			nodes: nodeMetadata
				.filter(({ workspaces }) => workspaces.map((w) => w.image).includes(d.dockerImage))
				.map(({ id }) => id),
			...d,
		})),
	);
	return (
		<div className="flex h-full flex-col">
			<h1 className="py-6 text-3xl font-bold">Workspaces</h1>
			<section className="-ml-8">
				<DataTable data={data} columns={columns} />
			</section>
		</div>
	);
}
