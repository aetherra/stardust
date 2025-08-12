import { getConfig } from "@stardust/config";
import { redirect } from "next/navigation";
import ClientPage from "./page.client";

export default function Page() {
	if (!getConfig().auth.credentials?.enabled) redirect("/");
	return <ClientPage />;
}
