import auth from "@stardust/common/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./sidebar";
export const metadata: Metadata = {
	title: {
		absolute: "Admin | Stardust",
		template: " %s | Stardust",
	},
};
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (session?.user?.role !== "admin") redirect("/");
	return (
		<div className="flex flex-row gap-4">
			<AdminSidebar />
			<div className="h-full w-full px-4 mb-2">{children}</div>
		</div>
	);
}
export const dynamic = "force-dynamic";
