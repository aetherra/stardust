import ModeToggle from "@/components/mode-toggle";
import { Card, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<main className="flex min-h-screen items-center justify-center">
			<Card className="mx-auto flex h-auto w-96 flex-col items-center justify-center bg-card py-12">
				<CardTitle className="mb-4 flex items-center justify-center text-left text-2xl font-bold">
					<Sparkles />
					<span className="ml-2 text-2xl font-bold">Stardust</span>
				</CardTitle>
				{children}
			</Card>
			<ModeToggle className="fixed bottom-2 right-2" />
		</main>
	);
}
