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
	{
		dockerImage: "ghcr.io/spaceness/zen",
		friendlyName: "Zen",
		category: ["Browser"],
		icon: "https://raw.githubusercontent.com/zen-browser/.github/refs/heads/main/profile/logo-black.png",
	},
	{
		dockerImage: "ghcr.io/spaceness/firefox",
		friendlyName: "Firefox",
		category: ["Browser"],
		icon: "https://www.mozilla.org/media/protocol/img/logos/firefox/browser/logo.eb1324e44442.svg",
	},
	// {
	// 	dockerImage: "ghcr.io/spaceness/vscode",
	// 	friendlyName: "VSCode",
	// 	category: ["Development"],
	// 	icon: "https://code.visualstudio.com/assets/apple-touch-icon.png",
	// },
];
const insertion = await db.insert(workspace).values(workspaces).onConflictDoNothing().returning();
console.log(`✨Stardust: Seeded ${insertion.map((i) => i.dockerImage).join(", ") || "no images"}`);
process.exit(0);
