import type * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("rounded-lg border bg-card text-card-foreground shadow-xs", className)}
			data-slot="card"
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("flex flex-col space-y-1.5 p-6", className)} data-slot="card-header" {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
			data-slot="card-title"
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("text-sm text-muted-foreground", className)} data-slot="card-description" {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("p-6 pt-0", className)} data-slot="card-content" {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("flex items-center p-6 pt-0", className)} data-slot="card-footer" {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
