"use client";
import { Button } from "@/components/ui/button";
// import { createSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
export function CreateSessionButton({ image }: { image: string }) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	return (
		<Button
			disabled={isPending}
			onClick={() =>
				startTransition(async () => {
					// const session = await createSession(image).catch(() => {
					// 	toast.error("Error creating session");
					// });
					// if (!session) return;
					// router.push(`/view/${session[0].id}`);
					console.log("w riz?");
				})
			}
		>
			{isPending ? "Loading..." : "Launch"}
		</Button>
	);
}
