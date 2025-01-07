import { Elysia, t } from "elysia";
import createSession from "./create.js";
import deleteSession from "./delete.js";
import manageSession from "./manage.js";
// fill this
export default new Elysia({ prefix: "/session" })
	.put(
		"/",
		// todo: add other container config stuff here
		async ({ body }) => {
			await createSession(body.workspace);
		},
		{
			body: t.Object({
				workspace: t.String(),
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
