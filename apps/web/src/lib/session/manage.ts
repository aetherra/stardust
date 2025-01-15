"use server";
import db, { session as sessionSchema } from "@stardust/db";
import { eq } from "@stardust/db/utils";
import { getNode } from "./client";
import getSession from "./get-session";
export async function manageSession(id: string, action: SessionAction, admin?: boolean) {
	const session = await getSession(id, admin);
	const node = getNode(session);
	await node.sessions({ id: session.id }).patch({ action });
}

export async function deleteSession(id: string, admin?: boolean) {
	const session = await getSession(id, admin);
	const node = getNode(session);
	const res = await node.sessions({ id: session.id }).delete();
	if (res.error || !res.data.success) throw res.error || new Error("session deletion failed");
	await db.delete(sessionSchema).where(eq(sessionSchema.id, session.id));
}

export type SessionAction = Parameters<ReturnType<ReturnType<typeof getNode>["sessions"]>["patch"]>[0]["action"];
