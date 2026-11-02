import { getConfig } from "@stardust/config";
import { notFound } from "next/navigation";
import type { NextRequest } from "next/server";
import sharp from "sharp";
import getSession from "@/lib/session/get-session";

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const optimize = req.nextUrl.searchParams.get("optimize");
	const session = await getSession(params.slug);
	if (!session) notFound();
	const sessionNode = getConfig().nodes.find(({ id }) => id === session.node);

	const res = await fetch(
		`${sessionNode?.proto || "http"}://${sessionNode?.hostname}:${sessionNode?.port || 4000}/sessions/${params.slug}/screenshot`,
		{
			headers: {
				authorization: `Bearer ${sessionNode?.token}`,
			},
		},
	);

	if (!res.ok) return Response.json(res.body, { status: 500, headers: res.headers });
	if (!optimize)
		return new Response(res.body, {
			headers: res.headers,
		});
	const buffer = Buffer.from(await res.arrayBuffer());
	const resized = await sharp(buffer).resize({ width: 400 }).png({ quality: 50 }).toBuffer();

	return new Response(resized, {
		headers: {
			"content-type": "image/png",
			"content-length": resized.length.toString(),
		},
	});
}
