"use server";

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import { getConfig, validateConfig } from "@stardust/config";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

export async function saveConfig(text: string, restart = false) {
	try {
		const config = getConfig();
		if (restart) {
			if (!config.restartCommand) throw new Error("No restart command configured");
			after(() => {
				spawn("sh", ["-c", config.restartCommand as string], { stdio: "inherit", cwd: process.cwd() });
			});
		}
		if (!validateConfig(text)) {
			return { error: "Invalid configuration" };
		}
		try {
			await fs.writeFile(process.env.CONFIG_PATH as string, text);
		} catch (error) {
			console.error(error);
			return { error: `Failed to save configuration: ${(error as Error).message}` };
		}
		revalidatePath("/admin/config");
		return { success: true, restart };
	} catch (error) {
		console.error(error);
		return { error: `check server logs` };
	}
}
