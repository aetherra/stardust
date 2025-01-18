import { CardContent, CardHeader } from "@/components/ui/card";
import { ShieldX } from "lucide-react";
import { BackButton } from "./page.client";

export default async function AuthError({
	searchParams,
}: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
	const { error } = await searchParams;
	return (
		<>
			<CardHeader className="mx-auto mb-2 flex flex-col items-center justify-center">
				<ShieldX className="mb-10 h-12 w-12" />
				There was an error with authentication:
				{error ? (
					<span>
						<br />
						<span className="font-bold font-mono text-destructive">{error}</span>
					</span>
				) : null}
			</CardHeader>
			<CardContent className="text-center">
				Please <BackButton />. If the problem persists, please contact support.
			</CardContent>
		</>
	);
}
