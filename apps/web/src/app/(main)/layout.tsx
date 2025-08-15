import auth from "@stardust/common/auth";
import { getConfig } from "@stardust/config";
import { headers } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const userSession = await auth.api.getSession({
		headers: await headers(),
	});
	const credentials = getConfig().auth.credentials?.enabled;
	return (
		<SidebarProvider>
			<AppSidebar session={userSession} credentials={credentials} />
			<div className="flex flex-1 flex-col gap-4 pt-0 px-4">
				<SidebarTrigger className="fixed bottom-2" />
				{children}
			</div>
		</SidebarProvider>
	);
}
