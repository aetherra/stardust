"use server";

import { check } from "@/lib/admin-check";
import { deleteSession } from "@/lib/session/manage";
import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";
import db, { type SelectWorkspace, session, workspace } from "@stardust/db";
import { eq } from "@stardust/db/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateWorkspace(data: FormData) {
	await check();
	const fields = {
		friendlyName: data.get("friendlyName")?.toString() as string,
		category:
			data
				.get("category")
				?.toString()
				.split(",")
				.map((cat) => cat.trim()) || [],
		icon: data.get("icon")?.toString() as string,
	};
	await db
		.update(workspace)
		.set(fields)
		.where(eq(workspace.dockerImage, data.get("dockerImage")?.toString() as string));
	redirect("/admin/workspaces");
}
export async function deleteWorkspace(w: SelectWorkspace) {
	await check();
	await db.transaction(async (tx) => {
		const sessions = await tx.select().from(session).where(eq(session.dockerImage, w.dockerImage));
		await Promise.all(
			sessions.map((s) =>
				deleteSession({
					id: s.id,
					admin: true,
					dbClient: tx,
				}),
			),
		);
		await tx.delete(workspace).where(eq(workspace.dockerImage, w.dockerImage));
	});
	revalidatePath("/admin/workspaces");
}
export async function pullOnNode(workspace: SelectWorkspace, nId: string) {
	await check();
	const node = getConfig().nodes.find((n) => n.id === nId);
	if (!node) {
		throw new Error("Node not found");
	}
	const connector = stardustConnector(node);
	// todo: i need to fix the fact it needs to be in the query param
	const { data, error } = await connector.workspaces.create.put(
		{ image: workspace.dockerImage },
		{ query: { id: workspace.dockerImage } },
	);
	if (error) throw new Error(error.value.message);
	return data;
}
export async function deleteImageFromNode(workspace: SelectWorkspace, nId: string) {
	await check();
	const node = getConfig().nodes.find((n) => n.id === nId);
	if (!node) {
		throw new Error("Node not found");
	}
	const connector = stardustConnector(node);
	const { data, error } = await connector.workspaces.info.delete(undefined, { query: { id: workspace.dockerImage } });
	if (error) throw new Error(error.value.message);
	revalidatePath("/admin/workspaces");
	return data;
}
