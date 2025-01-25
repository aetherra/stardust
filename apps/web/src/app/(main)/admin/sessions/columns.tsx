"use client";
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
import type { SelectSessionRelation } from "@stardust/db/relational-types";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { massDelete } from "./actions";
export const columns: ColumnDef<SelectSessionRelation>[] = [
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
		header: "Container ID",
		cell: ({ row }) => {
			return row.original.id.slice(0, 7);
		},
	},
	{
		accessorKey: "user",
		header: ({ column }) => <DataTableColumnHeader column={column} title="User Email" />,
		cell: ({ row }) => {
			return row.original.user.email;
		},
	},
	{ accessorKey: "dockerImage", header: ({ column }) => <DataTableColumnHeader column={column} title="Image" /> },
	{
		accessorKey: "createdAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Created at" />,
		cell: ({ row }) => {
			const date = new Date(row.original.createdAt);
			return date.toLocaleString();
		},
	},
	{
		accessorKey: "expiresAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Expires at" />,
		cell: ({ row }) => {
			const date = new Date(row.original.expiresAt);
			return date.toLocaleString();
		},
	},
	{
		id: "actions",
		header: ({ table }) => {
			return table.getFilteredSelectedRowModel().rows.length > 0 ? (
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
								toast.promise(() => massDelete(table.getFilteredSelectedRowModel().rows), {
									loading: "Deleting containers...",
									success: "Sessions deleted",
									error: (error) => `Failed to delete container: ${error}`,
								})
							}
						>
							Delete sessions
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : null;
		},
		cell: ({ row }) => {
			const session = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(session.id)}>
							Copy session ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() =>
								toast.promise(
									() => manageSession({ id: session.id, action: "stop", admin: true, revalidate: "/admin/sessions" }),
									{
										loading: "Stopping container...",
										success: "Session stopped",
										error: (error) => `Failed to stop container: ${error}`,
									},
								)
							}
						>
							Stop session
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								toast.promise(() => deleteSession({ id: session.id, admin: true, revalidate: "/admin/sessions" }), {
									loading: "Deleting session...",
									success: "Session deleted",
									error: (error) => `Failed to delete container: ${error}`,
								})
							}
						>
							Delete session
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
