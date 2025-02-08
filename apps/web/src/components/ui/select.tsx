"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

function SelectTrigger({ className, children, ...rest }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
	return (
		<SelectPrimitive.Trigger
			className={cn(
				"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
				className,
			)}
			data-slot="select-trigger"
			{...rest}
		>
			{children}
			<SelectPrimitive.Icon asChild>
				<ChevronDown className="h-4 w-4 opacity-50" />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}

function SelectScrollUpButton({ className, ...rest }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
	return (
		<SelectPrimitive.ScrollUpButton
			className={cn("flex cursor-default items-center justify-center py-1", className)}
			data-slot="select-scroll-up-button"
			{...rest}
		>
			<ChevronUp className="h-4 w-4" />
		</SelectPrimitive.ScrollUpButton>
	);
}

function SelectScrollDownButton({ className, ...rest }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
	return (
		<SelectPrimitive.ScrollDownButton
			className={cn("flex cursor-default items-center justify-center py-1", className)}
			data-slot="select-scroll-down-button"
			{...rest}
		>
			<ChevronDown className="h-4 w-4" />
		</SelectPrimitive.ScrollDownButton>
	);
}

function SelectContent({
	className,
	children,
	position = "popper",
	...rest
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				className={cn(
					"relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
					position === "popper" &&
						"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
					className,
				)}
				position={position}
				data-slot="select-content"
				{...rest}
			>
				<SelectScrollUpButton />
				<SelectPrimitive.Viewport
					className={cn(
						"p-1",
						position === "popper" &&
							"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
					)}
				>
					{children}
				</SelectPrimitive.Viewport>
				<SelectScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
}

function SelectLabel({ className, ...rest }: React.ComponentProps<typeof SelectPrimitive.Label>) {
	return (
		<SelectPrimitive.Label
			className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
			data-slot="select-label"
			{...rest}
		/>
	);
}

function SelectItem({ className, children, ...rest }: React.ComponentProps<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			className={cn(
				"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
				className,
			)}
			data-slot="select-item"
			{...rest}
		>
			<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
				<SelectPrimitive.ItemIndicator>
					<Check className="h-4 w-4" />
				</SelectPrimitive.ItemIndicator>
			</span>

			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}

function SelectSeparator({ className, ...rest }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
	return (
		<SelectPrimitive.Separator
			className={cn("-mx-1 my-1 h-px bg-muted", className)}
			data-slot="select-separator"
			{...rest}
		/>
	);
}

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
};
