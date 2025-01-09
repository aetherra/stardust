import { docker } from "~/lib/docker.js";

export async function sendFile(id: string, name: string, file: Uint8Array) {
	const container = docker.getContainer(id);
	const payload = Buffer.from(Bun.gzipSync(file));
	await container.putArchive(payload, `/home/stardust/Uploads/${name}.gz`);
	await container.exec({
		Cmd: ["sh", "-c", "gunzip", `/home/stardust/Uploads/${name}.gz`],
	});
	return true;
}

export async function getFile(id: string, name: string) {
	const file = await new Promise<NodeJS.ReadableStream | undefined>((res, rej) =>
		docker.getContainer(id).getArchive(`/home/stardust/Downloads/${name}`, (err, data) => {
			if (err) rej(err);
			res(data);
		}),
	);
	if (!file) throw new Error("no file for some reason");
	const unzipped = Bun.gunzipSync(file.read());
	return unzipped;
}
