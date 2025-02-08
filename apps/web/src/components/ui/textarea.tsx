import type * as React from "react";

import { cn } from "@/lib/utils";
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			className={cn(
				"flex min-h-[80px] w-full rounded-md border border-input bg-background focus:outline-hidden px-3 py-2 text-base outline-hidden ring-0 !focus:ring-0 focus:ring-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				className,
			)}
			data-slot="textarea"
			{...props}
		/>
	);
}

export { Textarea };
