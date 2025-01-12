import { getNode } from "@/lib/session/client";
import getSession from "@/lib/session/get-session";
import type { NextRequest } from "next/server";
export async function GET(_req: NextRequest, props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const session = await getSession(params.slug);
	const nodeSession = getNode(session).sessions(session);
	const { data, error } = await nodeSession.screenshot.get();
	if (error) return Response.json({ error }, { status: 500 });
	if (data instanceof Buffer) {
		return new Response(data, {
			headers: {
				"Content-Type": "image/png",
			},
		});
	}
	return Response.json(data, { status: 500 });
}
