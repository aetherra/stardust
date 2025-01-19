import { docker } from "~/lib/docker";
// broken
export async function sendFile(id: string, name: string, file: Uint8Array) {
	const container = docker.getContainer(id);
	const payload = Buffer.from(Bun.gzipSync(file));
	await container.exec({
		Cmd: ["sh", "-c", "mkdir", "-p", "/home/stardust/uploads"],
	});
	await container.putArchive(payload, { path: `/home/stardust/Uploads/${name}.gz` });
	await container.exec({
		Cmd: ["sh", "-c", "gunzip", `/home/stardust/Uploads/${name}.gz`],
	});
	return true;
}
// broken
export async function getFile(id: string, name: string) {
	const file = await docker.getContainer(id).getArchive({ path: `/home/stardust/Downloads/${name}` });
	console.log(file.read());
	if (!file) throw new Error("no file for some reason");
	const unzipped = Bun.gunzipSync(file.read());
	return unzipped;
}

export async function listFiles(id: string) {
	const exec = await docker.getContainer(id).exec({
		Cmd: ["sh", "-c", "mkdir -p /home/stardust/Downloads;ls /home/stardust/Downloads"],
		AttachStdout: true,
		AttachStderr: true,
	});

	const stream = await exec.start({});
	const data = (
		await new Promise<string>((res, err) => {
			const out: string[] = [];
			stream.on("error", err);
			stream.on("data", (chunk) => out.push(chunk.toString()));
			stream.on("end", () => res(out.join("")));
		})
	)
		.split("\n")
		.filter(Boolean)
		.map((s) => s.replace("\x01\x00\x00\x00\x00\x00\x00\x1C", ""));
	return data;
}
