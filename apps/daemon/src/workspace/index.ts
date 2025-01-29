import { Elysia, t } from "elysia";
import { docker } from "~/lib/docker";
import { pullImage } from "./pull";
const imagePromises = new Map<string, ReturnType<typeof pullImage>>();
const query = t.Object({
	id: t.String(),
});
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
			imagePromises.set(body.image, pullStatus);
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
			const image = await imagePromises.get(query.image);
			if (!image) {
				return { success: false, error: "image is not touched" };
			}
			if (image.success) {
				imagePromises.delete(query.image);
			}
			return image;
		},
		{
			query: t.Object({
				image: t.String(),
			}),
		},
	);
