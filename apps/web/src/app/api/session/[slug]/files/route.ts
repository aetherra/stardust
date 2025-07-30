import { getConfig } from "@stardust/config";
import { notFound } from "next/navigation";
import type { NextRequest } from "next/server";
import { getNode } from "@/lib/session/client";
import getSession from "@/lib/session/get-session";

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const name = req.nextUrl.searchParams.get("name");
	const session = await getSession(params.slug);
	if (!session) notFound();
	const nodeSession = getNode(session).sessions({ id: session.id });
	if (name) {
		const { data, error } = await nodeSession.files.download({ name }).get();
		if (error) return Response.json(error, { status: 500 });
		return new Response(data, {
			headers: {
				"Content-Disposition": `attachment; filename=${name}`,
				"Content-Type": "application/octet-stream",
			},
		});
	}
	const { data, error } = await nodeSession.files.list.get();
	if (error) return Response.json(error, { status: 500 });
	return Response.json(data.list);
}
export async function PUT(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const name = req.nextUrl.searchParams.get("name");
	if (!name) return Response.json({ error: "no file name or file specified" }, { status: 400 });
	const session = await getSession(params.slug);
	if (!session) notFound();
	// eden being stupid
	const sessionNode = getConfig().nodes.find(({ id }) => id === session.node);
	const data = await (
		await fetch(
			`${sessionNode?.proto || "http"}://${sessionNode?.hostname}:${sessionNode?.port || 4000}/sessions/${params.slug}/files/upload/${name}`,
			{
				headers: {
					authorization: `Bearer ${sessionNode?.token}`,
				},
				body: await req.arrayBuffer(),
				method: "PUT",
			},
		)
	).json();
	if (!data.success) return Response.json(data.error, { status: 500 });
	return Response.json(data);
}
