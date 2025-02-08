"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");

function Label(props: React.ComponentProps<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>) {
	const { className, ...rest } = props;
	return <LabelPrimitive.Root className={cn(labelVariants(), className)} data-slot="label" {...rest} />;
}

export { Label };
