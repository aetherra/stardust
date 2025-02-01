"use server";

import { check } from "@/lib/admin-check";
import db, { workspace } from "@stardust/db";
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
