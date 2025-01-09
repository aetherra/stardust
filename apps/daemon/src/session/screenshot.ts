import { docker } from "~/lib/docker.js";
export default async function screenshot(id: string) {
	const container = docker.getContainer(id);
	const exec = await container.exec({
		Cmd: ["sh", "-c", "xwd -root | convert xwd:- png:- | base64"],
		AttachStdout: true,
		AttachStderr: true,
	});

	const stream = await exec.start({ hijack: true, stdin: true });
	const encoded = await new Promise<string>((res, err) => {
		const out: string[] = [];
		stream.on("error", err);
		stream.on("data", (chunk) => out.push(chunk.toString()));
		stream.on("end", () => res(out.join("")));
	});
	const file = Buffer.from(encoded, "base64");
	return file;
}
