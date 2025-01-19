import { getNode } from "@/lib/session/client";
import getSession from "@/lib/session/get-session";
import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest, props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const session = await getSession(params.slug);
	if (!session) {
		return Response.json({ exists: false, error: "Container not found" }, { status: 404 });
	}
	const nodeSession = getNode(session).sessions({ id: session.id });
	const { data, error } = await nodeSession.get();
	if (error) {
		return Response.json(
			{
				error,
				exists: false,
			},
			{ status: 500 },
		);
	}
	const { State } = data;
	if (!State.Running) await nodeSession.patch({ action: "start" });

	if (State.Paused) await nodeSession.patch({ action: "unpause" });

	return Response.json({
		exists: true,
		password: data.password,
	});
}
export const dynamic = "force-dynamic";
