"use server";

import { check } from "@/lib/admin-check";
import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";
import db, { type SelectWorkspace, workspace } from "@stardust/db";
import { redirect } from "next/navigation";

export async function updateWorkspace(data: FormData) {
	await check();
	const fields = {
		dockerImage: data.get("dockerImage")?.toString() as string,
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
		.insert(workspace)
		.values(fields)
		.onConflictDoUpdate({
			target: workspace.dockerImage,
			set: {
				category: fields.category,
				friendlyName: fields.friendlyName,
				icon: fields.icon,
			},
		});
	redirect("/admin/workspaces");
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
	return data;
}
