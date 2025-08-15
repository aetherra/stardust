"use client";
import type { ErrorContext } from "@stardust/common/auth/lib";
import type { SelectUserRelation } from "@stardust/db/relational-types";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import authClient from "@/lib/auth-client";
import { deleteUserSessions, revalidateHandler, safeBanUser, safeDeleteUser } from "./actions";
import { ResetPasswordDialog, UpdateUserDialog } from "./components";

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
		accessorKey: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
	},
	{
		accessorKey: "image",
		header: "Profile Picture",
		cell: ({ row }) =>
			row.original.image ? (
				<Image
					className="size-12 border rounded-md"
					alt={row.original.name}
					src={row.original.image}
					width={48}
					height={48}
				/>
			) : (
				"None"
			),
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
		cell: ({ row: { original: user } }) => {
			const [resetDialogOpen, setResetDialogOpen] = useState(false);
			const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
			const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
			return (
				<>
					<ResetPasswordDialog user={user} open={resetDialogOpen} setOpen={setResetDialogOpen} />
					<UpdateUserDialog user={user} open={updateDialogOpen} setOpen={setUpdateDialogOpen} />
					<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete User</AlertDialogTitle>
								<AlertDialogDescription>Are you sure you want to delete {user.email}?</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Nevermind</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => {
										toast.promise(
											async () => {
												const res = await safeDeleteUser(user.id);
												if (res?.error) {
													throw new Error(res.error as string);
												}
											},
											{
												loading: "Deleting user...",
												success: "User deleted",
												error: (error) => `Failed to delete user: ${error.message}`,
											},
										);
									}}
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
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy user ID</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									href={{
										pathname: "/admin/sessions",
										query: { user: user.email },
									}}
								>
									View sessions
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setUpdateDialogOpen(true)}>Edit user</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => setResetDialogOpen(true)}>Reset password</DropdownMenuItem>
							<DropdownMenuSeparator />
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
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() =>
									toast.promise(
										async () => {
											let data: { user?: { banned: boolean }; error?: unknown };
											if (user.banned) {
												data = await authClient.admin.unbanUser({ userId: user.id }, clientOptions);
											} else {
												data = await safeBanUser({ userId: user.id });
												if (data.error) {
													throw new Error(data?.error as string);
												}
											}
											return data;
										},
										{
											loading: "Banning user...",
											success: ({ user }) => `User ${user?.banned ? "banned" : "unbanned"}`,
											error: (error) => `Failed to ban user: ${error.message}`,
										},
									)
								}
							>
								{user.banned ? "Unban user" : "Ban user"}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>Delete user</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			);
		},
	},
];
