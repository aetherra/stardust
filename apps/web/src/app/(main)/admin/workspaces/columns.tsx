"use client";
import type { SelectWorkspace } from "@stardust/db";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteWorkspace } from "./actions";
import { NodeDialog, UpdateDialog } from "./components";

export const columns: ColumnDef<SelectWorkspace & { nodes: string[] }>[] = [
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
			<Image className="size-12" alt={row.original.friendlyName} src={row.original.icon} width={48} height={48} />
		),
	},
	{
		id: "actions",
		cell: ({ row: { original: workspace } }) => {
			const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
			const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
			const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
			return (
				<>
					<UpdateDialog workspace={workspace} open={updateDialogOpen} setOpen={setUpdateDialogOpen} />
					<NodeDialog workspace={workspace} open={nodeDialogOpen} setOpen={setNodeDialogOpen} />
					<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete Workspace</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to delete {workspace.friendlyName}?
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Nevermind</AlertDialogCancel>
								<AlertDialogAction
									onClick={() =>
										toast.promise(() => deleteWorkspace(workspace), {
											loading: "Deleting workspace...",
											success: "Workspace deleted",
											error: "Failed to delete workspace",
										})
									}
								>
									Yes, delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
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
							<DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>Delete from database</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			);
		},
	},
];
