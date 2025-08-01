import "@stardust/config/load-config";

import { eq, like } from "drizzle-orm";
import db, { workspace } from "./index";

async function main() {
	const matches = await db.select().from(workspace).where(like(workspace.dockerImage, "%spaceness%"));

	if (matches.length === 0) {
		console.log("No workspaces found with 'spaceness' in dockerImage.");
		return;
	}

	for (const ws of matches) {
		const newDockerImage = ws.dockerImage.replace(/spaceness/g, "aetherra");
		await db.update(workspace).set({ dockerImage: newDockerImage }).where(eq(workspace.dockerImage, ws.dockerImage));
		console.log(`Updated dockerImage: ${ws.dockerImage} -> ${newDockerImage}`);
	}
}

main().then(() => process.exit(0));
