import { Elysia, t } from "elysia";
import { getConfig } from "~/lib/config";
import { docker } from "~/lib/docker";
import addScreen from "./add-screen";
import createSession from "./create";
import deleteSession from "./delete";
import { filesFetch } from "./file";
import manageSession from "./manage";
import screenshot from "./screenshot";
export default new Elysia({ prefix: "/sessions" })
	.put(
		"/create",
		async ({ body }) => {
			const config = getConfig();
			const containers = (await docker.listContainers()).filter(
				(s) => s.HostConfig.NetworkMode === config.docker.network,
			);
			if (config.session.limit && config.session.limit <= containers.length) {
				throw new Error("Session limit reached");
			}
			const session = await createSession(body);
			return {
				success: true,
				id: session.Id,
				created: Date.now(),
			};
		},
		{
			body: t.Object({
				workspace: t.String(),
				user: t.String(),
				password: t.Optional(t.String()),
				environment: t.Optional(t.Record(t.String(), t.String())),
				offline: t.Optional(t.Boolean()),
				exposePorts: t.Optional(t.Array(t.String())),
				memory: t.Optional(t.Number()),
				nodeId: t.String(),
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
		const info = docker.getContainer(id);
		const container = await info.inspect();
		const stats = await info.stats({ stream: false });
		if (!stats || !container) {
			throw new Error(`No such container with id ${id}`);
		}
		const memUsage = stats.memory_stats.usage;
		const memLimit = stats.memory_stats.limit;
		const memPercent = memUsage / memLimit;
		const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;

		const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
		let cpuPercent = 0;
		if (systemDelta > 0 && cpuDelta > 0) {
			const numCpus = stats.cpu_stats.online_cpus || stats.cpu_stats.cpu_usage.percpu_usage.length;
			cpuPercent = (cpuDelta / systemDelta) * numCpus * 100;
		}
		// world class code
		const password = container.Config.Env.find((e) => e.startsWith("VNCPASSWORD="))?.split("=")[1];
		return {
			password,
			cpuPercent,
			memPercent,
			memUsage,
			memLimit,
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
	.get("/:id/screenshot", async ({ params: { id } }) => {
		const res = await screenshot(id);
		return new Response(res.body, {
			headers: {
				"Content-Type": "image/png",
			},
		});
	})
	.group("/:id/files", (app) =>
		app
			.get("/list", async ({ params: { id } }) => {
				const res = await filesFetch(id, "/list");
				return {
					success: res.ok,
					list: await res.json(),
				};
			})
			.get("/download/:name", async ({ params: { id, name } }) => {
				const res = await filesFetch(id, `/download?name=${name}`);
				return res.blob();
			})
			.put(
				"/upload/:name",
				async ({ params: { id, name }, body }) => {
					const res = await filesFetch(id, `/upload?name=${name}`, "PUT", Buffer.from(body as ArrayBuffer));
					return {
						success: res.ok,
					};
				},
				{
					parse: "arrayBuffer",
				},
			),
	)
	.put("/:id/addscreen", async ({ params: { id } }) => {
		console.log("hi");
		await addScreen(id);
		return {
			success: true,
		};
	});
