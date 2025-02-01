"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SelectWorkspaceRelation } from "@stardust/db/relational-types";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { UpdateDialog } from "./components";

export const columns: ColumnDef<SelectWorkspaceRelation & { nodes: string[] }>[] = [
	{
		accessorKey: "friendlyName",
		header: "Name",
	},
	{
		accessorKey: "dockerImage",
		header: "Docker Image",
	},
	{
		accessorKey: "category",
		header: "Category",
	},
	{
		accessorKey: "nodes",
		header: "Available Nodes",
	},
	{
		accessorKey: "icon",
		header: "Icon",
		cell: ({ row }) => (
			<Image className="h-12 w-12" alt={row.original.friendlyName} src={row.original.icon} width={48} height={48} />
		),
	},
	{
		id: "actions",
		cell: ({ row: { original: workspace } }) => {
			const [open, setOpen] = useState(false);
			return (
				<>
					<UpdateDialog workspace={workspace} open={open} setOpen={setOpen} />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => setOpen(true)}>Edit metadata</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			);
		},
	},
];
