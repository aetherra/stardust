"use client";
import { Button } from "@/components/ui/button";
import { createSession } from "@/lib/session/create";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
export function CreateSessionButton({ workspace }: { workspace: string }) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	return (
		<Button
			disabled={isPending}
			onClick={() =>
				startTransition(async () => {
					const session = await createSession(workspace).catch(() => {
						toast.error("Error creating session");
					});
					if (!session) return;
					// @ts-expect-error to be fixed later
					router.push(`/view/${session[0].id}`);
				})
			}
		>
			{isPending ? "Loading..." : "Launch"}
		</Button>
	);
}
