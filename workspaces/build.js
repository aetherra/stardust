import { spawn } from "node:child_process";
import { argv } from "node:process";

const defaultImages = ["chromium", "debian", "zen", "firefox"];
const x64Only = [];

const args = argv.slice(2);

const flags = args.filter((value) => value.startsWith("--"));

const optionalFlag = (flag) => (flags.includes(flag) ? flag : "");

function getFlagContents(flag, replacement) {
	const indexOf = flags.indexOf(flag);
	const nextArg = args[indexOf + 1];
	if (indexOf !== -1 && nextArg) {
		return nextArg;
	}
	return replacement;
}

function buildBase() {
	console.log("✨ Stardust: Building debian base...");
	const multiPlatformBuild = flags.includes("--multi-platform");
	return new Promise((resolve, reject) => {
		const baseProcess = spawn(
			"docker",
			[
				"buildx",
				"build",
				".",
				"-f",
				"base.Dockerfile",
				`--progress=${argv.includes("--quiet") ? "quiet" : "plain"}`,
				optionalFlag("--push"),
				multiPlatformBuild ? "--platform" : "",
				multiPlatformBuild ? "linux/amd64,linux/arm64" : "",
				"--tag",
				"ghcr.io/spaceness/debian-base",
			],
			{ stdio: "inherit", shell: true },
		);
		baseProcess.on("close", (code) => {
			if (code === 0) {
				resolve(0);
			} else {
				console.error(`✨ Stardust: Failed to build debian base with code ${code}`);
				reject(new Error("Build failed for debian base"));
			}
		});
		baseProcess.on("error", (err) => {
			console.error(`✨ Stardust: Error while building debian base: ${err.message}`);
			reject(err);
		});
	});
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
				`--progress=${argv.includes("--quiet") ? "quiet" : "plain"}`,
				optionalFlag("--push"),
				multiPlatformBuild ? "--platform" : "",
				multiPlatformBuild ? platforms : "",
				"--tag",
				`ghcr.io/spaceness/${image}`,
			],
			{ stdio: ["inherit", "pipe", "pipe"], shell: true },
		);

		process.stdout.on("data", (data) => {
			globalThis.process.stdout.write(`${image}: ${data}`);
		});

		process.stderr.on("data", (data) => {
			globalThis.process.stderr.write(`${image}: ${data}`);
		});
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
	let images = getFlagContents("--images", undefined);

	if (images) {
		images = images.split(",");
	} else {
		images = defaultImages;
	}
	if (argv.includes("--build-base")) {
		await buildBase();
	}

	await Promise.all(images.map(buildImage));
	console.log("✨ Stardust: All images built successfully!");
} catch (err) {
	console.error("✨ Stardust: One or more builds failed:");
	console.error(err);
}
