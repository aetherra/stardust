import { check } from "@/lib/admin-check";
import { getNodeWorkspaces } from "@/lib/workspaces";

export async function GET() {
	await check();
	const data = await getNodeWorkspaces();
	return Response.json(data);
}
