import { getConfig } from "~/lib/config";
import { docker } from "~/lib/docker";

export default async function addScreen(id: string) {
	const { resolution } = getConfig().session;
	const exec = await docker.getContainer(id).exec({
		Cmd: ["xrandr", "-q"],
		AttachStdout: true,
		AttachStderr: true,
	});
	const stream = await exec.start({});
	const output = await new Promise<string>((res, err) => {
		const out: string[] = [];
		stream
			.on("error", err)
			.on("data", (chunk) => out.push(chunk.toString()))
			.on("end", () => res(out.join("")));
	});
    const matches = output.match(/Screen (\d+):/g) || [];
	const numOfDisplays = Math.max(
        ...matches.map((match) => parseInt(match.match(/\d+/)?.[0] || "0", 10))
    ) + 1;
    const [width, height] = resolution?.split("x").map(Number) || [1920, 1080];
	await docker.getContainer(id).exec({
		Cmd: [
			"xrandr",
			"--setmonitor",
			`screen${numOfDisplays.toString()}`,
			`${width}/${width}x${height}/${height}+${width * numOfDisplays}+0`,
            "none"
		],
	});
    return numOfDisplays;
}
