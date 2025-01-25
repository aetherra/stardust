"use server";

import { type SessionAction, deleteSession, manageSession } from "@/lib/session/manage";
import type { SelectSession } from "@stardust/db";
import type { Row } from "@tanstack/react-table";
import { revalidatePath } from "next/cache";

export async function massDelete(sessions: Row<SelectSession>[]) {
	await Promise.all(sessions.map((s) => deleteSession({ id: s.original.id, admin: true })));
	revalidatePath("/admin/sessions");
}
export async function massManage(sessions: Row<SelectSession>[], action: SessionAction) {
	await Promise.all(sessions.map((s) => manageSession({ action, id: s.original.id, admin: true })));
	revalidatePath("/admin/sessions");
}
