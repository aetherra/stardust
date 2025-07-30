"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<>
			<CardHeader>
				<CardTitle className="text-destructive">Server Error</CardTitle>
				<CardDescription>Something went wrong processing your request</CardDescription>
			</CardHeader>
			<CardContent className="text-center">
				<div className="flex flex-col items-center justify-center gap-4">
					<p className="text-center">Digest: {error.digest ?? "none"}</p>
					{error.message ? (
						<code className="text-center text-lg font-bold text-destructive">
							{process.env.NODE_ENV === "production" ? "Contact the server host for more info" : error.message}
						</code>
					) : null}
					<Button className="text-center" onClick={reset}>
						Reset
					</Button>
					<p className="text-xs text-muted-foreground">More details are in the logs</p>
				</div>
			</CardContent>
		</>
	);
}
