import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";
import type { NextRequest } from "next/server";
import { check } from "@/lib/admin-check";
export async function GET(req: NextRequest) {
	await check();
	const image = decodeURIComponent(req.nextUrl.searchParams.get("image") || "");
	if (!image) return Response.json({ success: false, error: "No image query param" }, { status: 400 });
	const data = await Promise.all(
		getConfig().nodes.map(async (n) => {
			const connector = stardustConnector(n);
			const { data } = await connector.workspaces.create.get({
				query: {
					image,
				},
			});
			const { data: info } = await connector.workspaces.info.get({ query: { id: image } });
			return {
				id: n.id,
				status: data?.status,
				pulled: info?.success || false,
			};
		}),
	);
	return Response.json(data);
}
