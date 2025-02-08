import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
	"relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
	{
		variants: {
			variant: {
				default: "bg-background text-foreground",
				destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Alert({ className, variant, ...rest }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
	return <div role="alert" className={cn(alertVariants({ variant }), className)} data-slot="alert" {...rest} />;
}

function AlertTitle({ className, ...rest }: React.ComponentProps<"h5">) {
	return (
		<h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)} data-slot="alert-title" {...rest} />
	);
}

function AlertDescription({ className, ...rest }: React.ComponentProps<"div">) {
	return <div className={cn("text-sm [&_p]:leading-relaxed", className)} data-slot="alert-description" {...rest} />;
}

export { Alert, AlertTitle, AlertDescription };
