import { ApiReference } from "@scalar/nextjs-api-reference";
import auth from "@stardust/common/auth";
import { getConfig } from "@stardust/config";
import { forbidden } from "next/navigation";
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
	const session = await auth.api.getSession({
		headers: req.headers,
	});
	if (session?.user.role !== "admin") forbidden();
	const { id } = await params;
	const configEntry = getConfig().nodes.find((node) => node.id === id);
	if (!configEntry) return new Response(null, { status: 404 });
	const baseUrl = `${configEntry?.proto || "http"}://${configEntry?.hostname || "0.0.0.0"}:${configEntry?.port || 4000}`;
	return ApiReference({
		theme: "kepler",
		authentication: {
			http: {
				bearer: {
					token: configEntry.token,
				},
				basic: {
					username: "stardust",
					password: configEntry.token,
				},
			},
		},
		spec: {
			content: await (
				await fetch(`${baseUrl}/swagger/json`, {
					headers: {
						authorization: `Basic ${Buffer.from(`stardust:${configEntry?.token}`).toString("base64")}`,
					},
				})
			).text(),
		},
		servers: [
			{
				url: `/daemon-api/${id}/proxy`,
			},
		],
	})();
}
