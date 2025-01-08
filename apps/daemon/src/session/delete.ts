import { docker } from "~/lib/docker.js";

export default async function deleteSession(id: string) {
	await docker.getContainer(id).remove({ force: true });
	return true;
}
