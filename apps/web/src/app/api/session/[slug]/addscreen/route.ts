import { notFound } from "next/navigation";
import type { NextRequest } from "next/server";
import { getNode } from "@/lib/session/client";
import getSession from "@/lib/session/get-session";

export async function POST(_req: NextRequest, props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const session = await getSession(params.slug);
	if (!session) notFound();
	const nodeSession = getNode(session).sessions({ id: session.id });
	await nodeSession.addscreen.put();
	console.log("hi");
	return Response.json({
		success: true,
	});
}
