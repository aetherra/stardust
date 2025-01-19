import "@stardust/config/load-config";
import db, { workspace } from "./index";
const workspaces = [
	{
		dockerImage: "ghcr.io/spaceness/debian",
		friendlyName: "Debian",
		category: ["Desktop"],
		icon: "https://www.debian.org/logos/openlogo-nd.svg",
	},
	{
		dockerImage: "ghcr.io/spaceness/chromium",
		friendlyName: "Chromium",
		category: ["Browser"],
		icon: "https://www.chromium.org/_assets/icon-chromium-96.png",
	},
];
const insertion = await db.insert(workspace).values(workspaces).onConflictDoNothing().returning();
console.log(`✨Stardust: Seeded ${insertion.map((i) => i.dockerImage).join(", ") || "no images"}`);
process.exit(0);
