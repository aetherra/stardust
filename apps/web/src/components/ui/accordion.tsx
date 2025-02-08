"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
	return <AccordionPrimitive.Item className={cn("border-b", className)} data-slot="accordion-item" {...props} />;
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				className={cn(
					"flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
					className,
				)}
				data-slot="accordion-trigger"
				{...props}
			>
				{children}
				<ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
	return (
		<AccordionPrimitive.Content
			className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
			data-slot="accordion-content"
			{...props}
		>
			<div className={cn("pb-4 pt-0", className)}>{children}</div>
		</AccordionPrimitive.Content>
	);
}

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
