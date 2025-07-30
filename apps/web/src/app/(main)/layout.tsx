import auth from "@stardust/common/auth";
import { getConfig } from "@stardust/config";
import { headers } from "next/headers";
import Navigation from "@/components/navigation";
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const userSession = await auth.api.getSession({
		headers: await headers(),
	});
	const credentials = getConfig().auth.credentials?.enabled;
	return (
		<main className="h-[90vh]">
			<Navigation session={userSession} credentials={credentials} />
			{children}
		</main>
	);
}
