import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getConfig } from "@stardust/config";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--mono" });
export async function generateMetadata(): Promise<Metadata> {
	const config = getConfig();
	const headersList = await headers();
	const disp = Boolean(
		config.metadataUrl &&
			(headersList.get("x-forwarded-host") ?? headersList.get("host"))?.includes(new URL(config.metadataUrl).host),
	);
	return {
		title: {
			default: "Stardust",
			template: "%s | Stardust",
		},
		description: disp ? "Stardust is the platform for streaming isolated desktop containers." : undefined,
		openGraph: disp
			? {
					title: "Stardust",
					description: "Stardust is the platform for streaming isolated desktop containers.",
					type: "website",
					url: "https://stardust-docs.vercel.app",
				}
			: undefined,
	};
}
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable}`}>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					themes={["light", "dark", "zinc"]}
					enableSystem
					disableTransitionOnChange
				>
					<Toaster richColors theme="system" position="top-center" />
					<TooltipProvider>{children}</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
