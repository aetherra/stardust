"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
export function SkeletionImage({ className, ...props }: React.ComponentProps<typeof Image>) {
	return (
		<Image
			className={cn("data-[loaded=false]:animate-pulse data-[loaded=false]:bg-muted", className)}
			data-loaded="false"
			onLoad={(event) => {
				event.currentTarget.setAttribute("data-loaded", "true");
			}}
			{...props}
		/>
	);
}
