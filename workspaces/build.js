import { spawn } from "node:child_process";
import { argv } from "node:process";

const defaultImages = ["chromium", "debian", "zen", "firefox"];
const x64Only = [];

const args = argv.slice(2);

const flags = args.filter((value) => value.startsWith("--"));

const optionalFlag = (flag) => (flags.includes(flag) ? flag : "");

function getFlagContents (flag, replacement) {
	const indexOf = flags.indexOf(flag)
	const nextArg = args[indexOf + 1]
	if (indexOf != -1 && nextArg) {
		return nextArg
	} else {
		return replacement
	}
}

function buildImage(image) {
	return new Promise((resolve, reject) => {
		console.log(`✨ Stardust: Building ${image}...`);
		console.log(`Arguments: ${argv}`);
		const multiPlatformBuild = flags.includes("--multi-platform");
		const platforms = x64Only.includes(image) ? "linux/amd64" : "linux/amd64,linux/arm64";
		const process = spawn(
			"docker",
			[
				"buildx",
				"build",
				".",
				"-f",
				`${image}/Dockerfile`,
				optionalFlag("--quiet"),
				optionalFlag("--push"),
				multiPlatformBuild ? "--platform" : "",
				multiPlatformBuild ? platforms : "",
				"--tag",
				`ghcr.io/spaceness/${image}`,
			],
			{ stdio: "inherit", shell: true },
		);
		process.on("close", (code) => {
			if (code === 0) {
				resolve(0);
			} else {
				console.error(`✨ Stardust: Failed to build ${image} with code ${code}`);
				reject(new Error(`Build failed for ${image}`));
			}
		});

		process.on("error", (err) => {
			console.error(`✨ Stardust: Error while building ${image}: ${err.message}`);
			reject(err);
		});
	});
}

try {
	let images = getFlagContents("--images", undefined)

	if (images) {
		images = images.split(',')
	} else {
		images = defaultImages
	}

	await Promise.all(images.map(buildImage));
	console.log("✨ Stardust: All images built successfully!");
} catch (err) {
	console.error("✨ Stardust: One or more builds failed:");
	console.error(err);
}
