import Navigation from "@/components/navigation";
import auth from "@stardust/common/auth";
import { headers } from "next/headers";
export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const userSession = await auth.api.getSession({
		headers: await headers(),
	});
	return (
		<main className="h-[90vh]">
			<Navigation session={userSession} />
			{children}
		</main>
	);
}
