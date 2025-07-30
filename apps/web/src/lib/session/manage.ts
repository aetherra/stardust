"use server";
import db, { type DrizzleClient, session as sessionSchema } from "@stardust/db";
import { eq } from "@stardust/db/utils";
import { revalidatePath } from "next/cache";
import { getNode } from "./client";
import getSession from "./get-session";
export async function manageSession({
	id,
	action,
	admin,
	revalidate,
	dbClient = db,
}: {
	id: string;
	action: SessionAction;
	admin?: boolean;
	revalidate?: string;
	dbClient?: DrizzleClient;
}) {
	const session = await getSession(id, admin, dbClient);
	if (!session) throw new Error("session not found");
	const node = getNode(session);
	const res = await node.sessions({ id: session.id }).patch({ action });
	if (res.error || !res.data.success) throw res.error || new Error("session update failed");
	if (revalidate) revalidatePath(revalidate);
}

export async function deleteSession({
	id,
	admin,
	revalidate,
	dbClient = db,
}: {
	id: string;
	admin?: boolean;
	revalidate?: string;
	dbClient?: DrizzleClient;
}) {
	const session = await getSession(id, admin, dbClient);
	if (!session) throw new Error("session not found");
	const node = getNode(session);
	const res = await node.sessions({ id: session.id }).delete();
	if (res.error || !res.data.success) throw res.error || new Error("session deletion failed");
	await dbClient.delete(sessionSchema).where(eq(sessionSchema.id, session.id));
	if (revalidate) revalidatePath(revalidate);
}

export type SessionAction = Parameters<ReturnType<ReturnType<typeof getNode>["sessions"]>["patch"]>[0]["action"];
