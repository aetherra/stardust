"use server";

import auth from "@stardust/common/auth";
import db, { workspace } from "@stardust/db";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";
import { redirect } from "next/navigation";

async function check() {
	const userSession = await auth.api.getSession({ headers: await headers() });
	if (userSession?.user.role !== "admin") forbidden();
}
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
