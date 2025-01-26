"use client";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import authClient from "@/lib/auth-client";
import type { ErrorContext } from "@stardust/common/auth/lib";
import type { SelectUserRelation } from "@stardust/db/relational-types";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { deleteUserSessions, revalidateHandler, safeDeleteUser } from "./actions";
const clientOptions = {
	onSuccess() {
		revalidateHandler();
	},
	onError(ctx: ErrorContext) {
		throw ctx.error;
	},
};
export const columns: ColumnDef<SelectUserRelation>[] = [
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
		accessorKey: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
	},
	{
		accessorKey: "email",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
	},
	{
		accessorKey: "id",
	},
	{
		accessorKey: "role",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
	},
	{
		accessorKey: "banned",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Banned" />,
	},
	{
		id: "actions",
		cell: ({ row: { original: user } }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy user ID</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuCheckboxItem
						checked={user.role === "admin"}
						onCheckedChange={() =>
							toast.promise(
								() =>
									authClient.admin.setRole(
										{
											userId: user.id,
											role: user.role === "admin" ? "user" : "admin",
										},
										clientOptions,
									),
								{
									loading: "Changing role...",
									success: ({ data }) => `Role changed to ${data?.user.role}`,
									error: (error) => `Failed to change role: ${error.message}`,
								},
							)
						}
					>
						Admin
					</DropdownMenuCheckboxItem>
					<DropdownMenuItem
						onClick={() =>
							toast.promise(() => authClient.admin.revokeUserSessions({ userId: user.id }, clientOptions), {
								loading: "Revoking auth sessions...",
								success: "All auth sessions revoked",
								error: (error) => `Failed to revoke sessions: ${error.message}`,
							})
						}
					>
						Revoke all sessions
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							toast.promise(() => deleteUserSessions(user.id), {
								loading: "Deleting user's sessions...",
								success: "Sessions deleted",
								error: (error) => `Failed to delete sessions: ${error.message}`,
							})
						}
					>
						Delete user's sessions
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							toast.promise(
								() =>
									(user.banned ? authClient.admin.unbanUser : authClient.admin.banUser)(
										{ userId: user.id },
										clientOptions,
									),
								{
									loading: "Banning user...",
									success: ({ data }) => `User ${data?.user.banned ? "banned" : "unbanned"}`,
									error: (error) => `Failed to ban user: ${error.message}`,
								},
							)
						}
					>
						{user.banned ? "Unban user" : "Ban user"}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							toast.promise(() => safeDeleteUser(user.id), {
								loading: "Deleting user...",
								success: "User deleted",
								error: (error) => `Failed to delete user: ${error.message}`,
							})
						}
					>
						Delete user
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
