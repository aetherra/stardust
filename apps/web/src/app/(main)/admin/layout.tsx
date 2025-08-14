import auth from "@stardust/common/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";

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
	if (session?.user?.role !== "admin") forbidden();
	return <div className="flex h-full flex-col">{children}</div>;
}

export const dynamic = "force-dynamic";
