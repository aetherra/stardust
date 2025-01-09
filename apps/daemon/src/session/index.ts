import { Elysia, t } from "elysia";
import { getConfig } from "~/lib/config/index.js";
import { docker } from "~/lib/docker.js";
import createSession from "./create.js";
import deleteSession from "./delete.js";
import { getFile, sendFile } from "./file.js";
import manageSession from "./manage.js";
import screenshot from "./screenshot.js";
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
	.get("/:id/screenshot", async ({ params: { id }, set }) => {
		try {
			const res = await screenshot(id);
			set.headers["Content-Type"] = "image/png";
			return res;
		} catch (e) {
			set.status = 500;
			return {
				success: false,
				error: e,
			};
		}
	})
	.group("/:id/files", (app) =>
		app
			.get("/list", async ({ params: { id } }) => {
				const exec = await docker.getContainer(id).exec({
					Cmd: ["sh", "-c", "ls /home/stardust/Downloads"],
					AttachStdout: true,
					AttachStderr: true,
				});

				const stream = await exec.start({ hijack: true, stdin: true });
				const data = await new Promise<string>((res, err) => {
					const out: string[] = [];
					stream.on("error", err);
					stream.on("data", (chunk) => out.push(chunk.toString()));
					stream.on("end", () => res(out.join("")));
				});
				return {
					success: true,
					data: data.split("\n").filter(Boolean),
				};
			})
			.get("/download/:name", async ({ params: { id, name } }) => getFile(id, name))
			.put(
				"/upload/:name",
				async ({ params: { id, name }, body }) => {
					const res = await sendFile(id, name, body);
					return {
						success: res,
					};
				},
				{
					body: t.Uint8Array(),
				},
			),
	);
