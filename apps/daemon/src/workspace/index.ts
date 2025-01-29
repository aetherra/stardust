import { Elysia, type Static, t } from "elysia";
import { docker } from "~/lib/docker";
import { pullImage } from "./pull";
const statuses = t.Union([
	t.Literal("pulled"),
	t.Literal("in-progress"),
	t.Literal("not-started"),
	t.Literal("failed"),
	t.Literal("not-touched"),
]);
const query = t.Object({
	id: t.String(),
});

const imagePromises = new Map<
	string,
	{
		status: Static<typeof statuses>;
	}
>();

export default new Elysia({ prefix: "/workspaces" })
	.get("/", async () => {
		const workspaces = (
			await Promise.all((await docker.listImages()).map((i) => docker.getImage(i.Id).inspect()))
		).filter((i) => i.Config.User === "stardust");
		return {
			success: true,
			workspaces,
		};
	})
	.group("/info", (app) =>
		app
			.get(
				"",
				async ({ query }) => {
					const data = await docker.getImage(query.id).inspect();
					return {
						success: true,
						...data,
					};
				},
				{
					query,
				},
			)
			.delete(
				"",
				async ({ query }) => {
					await docker.getImage(query.id).remove();
					return {
						success: true,
					};
				},
				{ query },
			),
	)
	.put(
		"/create",
		async ({ body }) => {
			if (imagePromises.has(body.image)) {
				return { success: false, error: "Image pull already in progress" };
			}
			const pullStatus = pullImage(`${body.image}:latest`);
			imagePromises.set(body.image, { status: "in-progress" });

			pullStatus
				.then(() => imagePromises.set(body.image, { status: "pulled" }))
				.catch(() => imagePromises.set(body.image, { status: "failed" }));

			return { success: true, status: "in-progress" };
		},
		{
			body: t.Object({
				image: t.String(),
			}),
		},
	)
	.get(
		"/create",
		async ({ query }) => {
			const image = imagePromises.get(query.image);
			if (!image) {
				try {
					const inspect = await docker.getImage(query.image).inspect();
					return {
						success: true,
						status: "pulled",
						...inspect,
					};
				} catch (e) {
					return {
						success: false,
						status: "failed",
						error: (e as Error).message,
					};
				}
			}
			if (image.status === "pulled" || image.status === "failed") {
				imagePromises.delete(query.image);
			}
			return { success: true, status: image.status };
		},
		{
			query: t.Object({
				image: t.String(),
			}),
			response: t.Object({
				success: t.Boolean(),
				status: statuses,
			}),
		},
	);
