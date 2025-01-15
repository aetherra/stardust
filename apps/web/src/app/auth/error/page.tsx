"use client";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { ShieldX } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthError() {
	const params = useSearchParams();
	const router = useRouter();
	return (
		<>
			<CardHeader className="mx-auto mb-2 flex flex-col items-center justify-center">
				<ShieldX className="mb-10 h-12 w-12" />
				There was an error with authentication:
				{params.get("error") ? (
					<span>
						<br />
						<span className="font-bold font-mono text-destructive">{params.get("error")}</span>
					</span>
				) : null}
			</CardHeader>
			<CardContent className="text-center">
				Please{" "}
				<Button variant="link" onClick={router.back} className="-px-0 text-md">
					try again
				</Button>
				. If the problem persists, please contact support.
			</CardContent>
		</>
	);
}
