import { Info, Loader2 } from "lucide-react";

export function Loading({ text }: { text: string }) {
	return (
		<div className="h-40 w-96 bg-accent/50 rounded-lg border border-border/50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md flex items-center justify-center text-muted-foreground gap-3">
			<Loader2 className="animate-spin" />
			<h1 className="text-2xl font-bold">{text}</h1>
		</div>
	);
}
export function ConnectionAlert({ text, error }: { text: string; error?: boolean }) {
	if (error) throw new Error(text);
	return (
		<div className="h-40 w-96 bg-accent/50 rounded-lg border border-border/50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md flex items-center justify-center text-muted-foreground gap-3">
			<Info className={`${error && "text-destructive"}`} />
			<h1 className="text-2xl font-semibold">{text}</h1>
		</div>
	);
}
