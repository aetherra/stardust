import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Stardust",
		short_name: "Stardust",
		description: "Stardust is the platform for streaming isolated desktop containers.",
		start_url: "/",
		display: "standalone",
		background_color: "#1e1e2e",
		theme_color: "#cba6f7",
		icons: [
			{
				src: "/icon.svg",
				sizes: "192x192",
			},
			{
				src: "/icon.svg",
				sizes: "512x512",
			},
		],
	};
}
