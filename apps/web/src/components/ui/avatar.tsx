"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Avatar(props: React.ComponentProps<typeof AvatarPrimitive.Root>) {
	const { className, ...rest } = props;
	return (
		<AvatarPrimitive.Root
			className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
			data-slot="avatar"
			{...rest}
		/>
	);
}

function AvatarImage(props: React.ComponentProps<typeof AvatarPrimitive.Image>) {
	const { className, ...rest } = props;
	return (
		<AvatarPrimitive.Image
			className={cn("aspect-square h-full w-full", className)}
			data-slot="avatar-image"
			{...rest}
		/>
	);
}

function AvatarFallback(props: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
	const { className, ...rest } = props;
	return (
		<AvatarPrimitive.Fallback
			className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
			data-slot="avatar-fallback"
			{...rest}
		/>
	);
}

export { Avatar, AvatarImage, AvatarFallback };
