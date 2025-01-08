import { Elysia, t } from "elysia";
import { getConfig } from "~/lib/config/index.js";
import { docker } from "~/lib/docker.js";
import createSession from "./create.js";
import deleteSession from "./delete.js";
import { getFile, sendFile } from "./file.js";
import manageSession from "./manage.js";
// fill this
export default new Elysia({ prefix: "/sessions" })
	.put(
		"/",
		async ({ body }) => {
			const session = await createSession(body);
			return {
				success: true,
				id: session.Id,
				created: session.Created,
			};
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
	.get("/list", async () => {
		const config = getConfig();
		const containers = (await docker.listContainers()).filter(
			(s) => s.HostConfig.NetworkMode === config.docker.network,
		);
		return {
			success: true,
			containers,
		};
	})
	.get("/:id", async ({ params: { id } }) => {
		const container = await docker.getContainer(id).inspect();
		if (!container) {
			throw new Error(`No such container with id ${id}`);
		}
		return {
			success: true,
			...container,
		};
	})
	.patch(
		"/:id",
		async ({ params: { id }, body }) => {
			await manageSession(id, body.action);
			return { success: true };
		},
		{
			body: t.Object({
				action: t.UnionEnum(["start", "stop", "pause", "unpause", "restart"]),
			}),
		},
	)
	.delete("/:id", async ({ params: { id } }) => {
		await deleteSession(id);
		return { success: true };
	})
	.group("/:id/files", (app) =>
		app
			.get("/list", () => {
				return true; // do this later (I HATE DOCKER)
			})
			.get("/download/:name", async ({ params: { id, name } }) => getFile(id, name))
			.put(
				"/upload/:name",
				async ({ params: { id, name }, body }) => {
					const res = await sendFile(id, name, Buffer.from(body));
					return {
						success: res,
					};
				},
				{
					body: t.Uint8Array(),
				},
			),
	);
