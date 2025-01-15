import { getNode } from "@/lib/session/client";
import getSession from "@/lib/session/get-session";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const name = req.nextUrl.searchParams.get("name");
	const session = await getSession(params.slug);
	const nodeSession = getNode(session).sessions({ id: session.id });
	if (name) {
		const { data, error } = await nodeSession.files.download({ name }).get();
		if (error) return Response.json({ error }, { status: 500 });
		return new Response(new Blob([data]), {
			headers: {
				"Content-Disposition": `attachment; filename=${name}`,
				"Content-Type": "application/octet-stream",
			},
		});
	}
	const { data, error } = await nodeSession.files.list.get();
	if (error) return Response.json({ error }, { status: 500 });
	return Response.json(data.list);
}
export async function PUT(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const name = req.nextUrl.searchParams.get("name");
	if (!name) return Response.json({ error: "no file name specified" }, { status: 400 });
	const session = await getSession(params.slug);
	const nodeSession = getNode(session).sessions({ id: session.id });
	const { data, error } = await nodeSession.files.upload({ name }).put(new Uint8Array(await req.arrayBuffer()));
	if (error) return Response.json({ error }, { status: 500 });
	return Response.json(data);
}
