"use client";
import type { SelectSessionRelation } from "@stardust/db/relational-types";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteSession, manageSession } from "@/lib/session/manage";
import { massDelete, massManage } from "./actions";

export const columns: ColumnDef<SelectSessionRelation & { status: string }>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => row.original.id.slice(0, 7),
	},
	{
		accessorKey: "user",
		header: ({ column }) => <DataTableColumnHeader column={column} title="User Email" />,
		cell: ({ row }) => row.original.user.email,
	},
	{ accessorKey: "dockerImage", header: ({ column }) => <DataTableColumnHeader column={column} title="Image" /> },
	{ accessorKey: "node", header: ({ column }) => <DataTableColumnHeader column={column} title="Node" /> },
	{
		accessorKey: "createdAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Created at" />,
		cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
	},
	{
		accessorKey: "expiresAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Expires at" />,
		cell: ({ row }) => new Date(row.original.expiresAt).toLocaleString(),
	},
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
	},
	{
		id: "actions",
		header: ({ table }) =>
			table.getFilteredSelectedRowModel().rows.length > 0 ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								// @ts-ignore typescript is doing smth weird
								toast.promise(() => massManage(table.getFilteredSelectedRowModel().rows, "pause"), {
									loading: "Pausing containers...",
									success: "Sessions paused",
									error: "Failed to pause a container",
								})
							}
						>
							Pause
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								// @ts-ignore typescript is doing smth weird
								toast.promise(() => massManage(table.getFilteredSelectedRowModel().rows, "stop"), {
									loading: "Stopping containers...",
									success: "Sessions stopped",
									error: "Failed to stop a container",
								})
							}
						>
							Stop
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								// @ts-ignore typescript is doing smth weird
								toast.promise(() => massDelete(table.getFilteredSelectedRowModel().rows), {
									loading: "Deleting containers...",
									success: "Sessions deleted",
									error: "Failed to delete a session",
								})
							}
						>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : null,
		cell: ({ row: { original: session } }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => navigator.clipboard.writeText(session.id)}>Copy session ID</DropdownMenuItem>
					<DropdownMenuSeparator />

					<DropdownMenuItem
						onClick={() =>
							toast.promise(
								() => manageSession({ id: session.id, action: "pause", admin: true, revalidate: "/admin/sessions" }),
								{
									loading: "Pausing container...",
									success: "Session paused",
									error: "Failed to pause container",
								},
							)
						}
					>
						Pause
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							toast.promise(
								() => manageSession({ id: session.id, action: "stop", admin: true, revalidate: "/admin/sessions" }),
								{
									loading: "Stopping container...",
									success: "Session stopped",
									error: "Failed to stop container",
								},
							)
						}
					>
						Stop
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							toast.promise(() => deleteSession({ id: session.id, admin: true, revalidate: "/admin/sessions" }), {
								loading: "Deleting session...",
								success: "Session deleted",
								error: "Failed to delete container",
							})
						}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
