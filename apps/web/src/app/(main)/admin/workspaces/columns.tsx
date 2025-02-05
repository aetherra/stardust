"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNodeWorkspaces } from "@/lib/workspaces";
import type { SelectWorkspaceRelation } from "@stardust/db/relational-types";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { deleteWorkspace } from "./actions";
import { NodeDialog, UpdateDialog } from "./components";

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
			const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
			const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
			return (
				<>
					<UpdateDialog workspace={workspace} open={updateDialogOpen} setOpen={setUpdateDialogOpen} />
					<NodeDialog workspace={workspace} open={nodeDialogOpen} setOpen={setNodeDialogOpen} />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => setUpdateDialogOpen(true)}>Edit metadata</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setNodeDialogOpen(true)}>Edit nodes</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									toast.promise(() => deleteWorkspace(workspace), {
										loading: "Deleting workspace...",
										success: "Workspace deleted",
										error: "Failed to delete workspace",
									})
								}
							>
								Delete workspace
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			);
		},
	},
];
