import auth from "@stardust/common/auth";
import { getConfig } from "@stardust/config";
import { forbidden } from "next/navigation";
import type { NextRequest } from "next/server";
async function handler(req: NextRequest, { params }: { params: Promise<{ id: string; path?: string[] }> }) {
	const session = await auth.api.getSession({
		headers: req.headers,
	});
	if (session?.user.role !== "admin") forbidden();
	const { id, path } = await params;
	const configEntry = getConfig().nodes.find((node) => node.id === id);
	if (!configEntry) return new Response(null, { status: 404 });
	const baseUrl = `${configEntry?.proto || "http"}://${configEntry?.hostname || "0.0.0.0"}:${configEntry?.port || 4000}`;
	return fetch(`${baseUrl}/${path ? path.join("/") : ""}?${req.nextUrl.search}`, {
		headers: {
			authorization: req.headers.get("authorization") || "",
		},
		method: req.method,
		body: req.body,
	});
}
export const [GET, POST, PUT, DELETE, PATCH] = Array(5).fill(handler);
