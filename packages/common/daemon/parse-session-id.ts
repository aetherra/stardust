export type ParsedSessionId = {
	user: string;
	code: string;
	node: string;
} | null;
export default function parseSessionId(id: string): ParsedSessionId {
	const [user, node, code] = id.split("-");
	if (!user || !node || !code) return null;
	return { user, node, code };
}
