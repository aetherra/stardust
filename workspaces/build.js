const images = ["chromium", "debian", "zen", "firefox"];
const x64Only = [];

import { spawn } from "node:child_process";
import { argv } from "node:process";
const optionalArgs = (a) => (process.argv.includes(a) ? a : "");
function buildImage(image) {
	return new Promise((resolve, reject) => {
		console.log(`✨ Stardust: Building ${image}...`);
		console.log(`Arguments: ${argv}`);
		const multiPlatformBuild = argv.includes("--multi-platform");
		const platforms = x64Only.includes(image) ? "linux/amd64" : "linux/amd64,linux/arm64";
		const process = spawn(
			"docker",
			[
				"buildx",
				"build",
				".",
				"-f",
				`${image}/Dockerfile`,
				optionalArgs("--quiet"),
				optionalArgs("--push"),
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
	await Promise.all(images.map(buildImage));
	console.log("✨ Stardust: All images built successfully!");
} catch (err) {
	console.error("✨ Stardust: One or more builds failed:");
	console.error(err);
}
