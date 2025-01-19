import { getNode } from "@/lib/session/client";
import getSession from "@/lib/session/get-session";
import type { NextRequest } from "next/server";
export async function GET(_req: NextRequest, props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const session = await getSession(params.slug);
	const nodeSession = getNode(session).sessions({ id: session.id });
	const { data, error } = await nodeSession.screenshot.get();
	if (error) return Response.json({ error }, { status: 500 });
	return new Response(Buffer.from(data.encoded, "base64"), {
		headers: {
			"Content-Type": "image/png",
		},
	});
}
