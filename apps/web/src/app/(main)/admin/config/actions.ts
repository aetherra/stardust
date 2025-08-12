"use server";

import fs from "node:fs/promises";
import { validateConfig } from "@stardust/config";

export default async function saveConfig(text: string) {
	try {
		if (!validateConfig(text)) {
			return { error: "Invalid configuration" };
		}
		try {
			await fs.writeFile(process.env.CONFIG_PATH as string, text);
		} catch (error) {
			console.error(error);
			return { error: `Failed to save configuration: ${(error as Error).message}` };
		}
		return { success: true };
	} catch (error) {
		console.error(error);
		return { error: `check server logs` };
	}
}
