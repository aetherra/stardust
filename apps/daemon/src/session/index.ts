import { Elysia, t } from "elysia";
import createSession from "./create.js";
import deleteSession from "./delete.js";
import manageSession from "./manage.js";
// fill this
export default new Elysia({ prefix: "/session" })
	.put(
		"/",
		async ({ body }) => {
			try {
				const session = await createSession(body);
				return {
					success: true,
					id: session.Id,
					created: session.Created,
				};
			} catch (e) {
				return { success: false, error: e };
			}
		},
		{
			body: t.Object({
				workspace: t.String(),
				user: t.String(),
				environment: t.Optional(t.Record(t.String(), t.String())),
				offline: t.Optional(t.Boolean()),
				exposePorts: t.Optional(t.Array(t.String())),
				memory: t.Optional(t.Number()),
			}),
		},
	)
	.patch(
		"/:id",
		async ({ params: { id }, body }) => {
			try {
				await manageSession(id, body.action);
				return { success: true };
			} catch (e) {
				return { success: false, error: e };
			}
		},
		{
			body: t.Object({
				action: t.UnionEnum(["start", "stop", "pause", "unpause", "restart"]),
			}),
		},
	)
	.delete("/:id", async ({ params: { id } }) => {
		try {
			await deleteSession(id);
			return { success: true };
		} catch (e) {
			return { success: false, error: e };
		}
	});
