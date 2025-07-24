import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import auth from "@stardust/common/auth";
import { ChevronLeft, LogOut } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function SignOut() {
	return (
		<CardContent>
			<p className="text-center">Are you sure you want to sign out?</p>
			<form
				action={async () => {
					"use server";
					const res = await auth.api.signOut({
						headers: await headers(),
					});
					if (res.success) redirect("/auth/signin");
				}}
			>
				<SubmitButton className="mt-6 w-full">
					<LogOut className="mr-2 size-4" />
					Sign out
				</SubmitButton>
			</form>
			<Button
				asChild
				variant="outline"
				className="mt-4 w-full bg-background/50 transition-all duration-200 hover:bg-background/65"
			>
				<Link href="/">
					<ChevronLeft className="mr-2 size-4" />
					Go Home
				</Link>
			</Button>
		</CardContent>
	);
}
