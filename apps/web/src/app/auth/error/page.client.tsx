"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function BackButton() {
	const router = useRouter();
	return (
		<Button variant="link" onClick={router.back} className="-px-0 text-md">
			try again
		</Button>
	);
}
