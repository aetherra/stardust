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
	return Response.json({
		maxSize: getConfig().session?.uploadLimit,
		...data,
	});
}
