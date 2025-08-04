"use server";

import { getNode } from "./client";
import getSession from "./get-session";

export default async function upload(form: FormData, sessionId: string) {
	const file = form.get("file") as File;
	try {
		if (!file || !sessionId) return { success: false, error: "no file name or file specified, this shouldnt happen" };
		const session = await getSession(sessionId);
		if (!session) return { success: false, error: "session not found" };
		const nodeSession = getNode(session).sessions({ id: session.id });
		const { data, error } = await nodeSession.files.upload({ name: file.name }).put(await file.arrayBuffer());
		if (error) return { success: false, error: error.value.summary };
		return { success: data.success };
	} catch (error) {
		console.error(error);
		return { success: false, error: "internal server error" };
	}
}
