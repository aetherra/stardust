import db from "@stardust/db";
import type { Metadata } from "next";
import { DataTable } from "@/components/ui/data-table";
import { getNode } from "@/lib/session/client";
import { columns } from "./columns";
export const metadata: Metadata = {
	title: "Sessions",
};
export default async function AdminPage() {
	const dbData = await db.query.session.findMany({
		with: {
			user: true,
		},
	});
	const data = await Promise.all(
		dbData.map(async (session) => ({
			...session,
			status: (await getNode(session).sessions({ id: session.id }).get()).data?.State.Status || "Unknown",
		})),
	);
	return (
		<div className="flex h-full flex-col">
			<h1 className="py-6 text-3xl font-bold">Sessions</h1>
			<section className="-ml-8">
				<DataTable data={data} columns={columns} />
			</section>
		</div>
	);
}
