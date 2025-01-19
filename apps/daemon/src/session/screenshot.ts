import { docker } from "~/lib/docker";
export default async function screenshot(id: string) {
	const exec = await docker.getContainer(id).exec({
		Cmd: ["sh", "-c", "xwd -root -display :1 | convert xwd:- png:- | base64"],
		AttachStdout: true,
		AttachStderr: true,
	});

	const stream = await exec.start({});
	const encoded = await new Promise<string>((res, err) => {
		const out: string[] = [];
		stream.on("error", err);
		stream.on("data", (chunk) => out.push(chunk.toString()));
		stream.on("end", () => res(out.join("")));
	});
	return encoded.replaceAll(/[^A-Za-z0-9+/=]/g, "");
}
