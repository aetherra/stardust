"use client";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authClient from "@/lib/auth-client";
import type { ErrorContext } from "@stardust/common/auth/lib";
import type { SelectUserRelation } from "@stardust/db/relational-types";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteUserSessions, resetPassword, revalidateHandler, safeDeleteUser } from "./actions";
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
			return (
				<>
					<Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Reset password for {user.name || user.email}</DialogTitle>
							</DialogHeader>
							<form
								action={(data) =>
									toast.promise(
										async () => {
											const res = await resetPassword(user.id, data);
											if (res?.error) throw new Error(res.error);
											return res;
										},
										{
											loading: "Resetting password...",
											success: "Password reset",
											error: (error) => `Failed to reset password: ${error.message}`,
										},
									)
								}
								className="flex flex-col gap-2 w-full"
							>
								<Label htmlFor="new-password">New password</Label>
								<Input
									id="new-password"
									placeholder="New password"
									name="new-password"
									minLength={8}
									type="password"
									required
								/>
								<div className="flex items-center gap-2">
									<Checkbox id="revoke-others" name="revoke-others" defaultChecked />
									<Label htmlFor="revoke-others">Sign out of all other devices</Label>
								</div>
								<SubmitButton>Submit</SubmitButton>
							</form>
						</DialogContent>
					</Dialog>
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
							<DropdownMenuItem onClick={() => setResetDialogOpen(true)}>Reset password</DropdownMenuItem>
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
				</>
			);
		},
	},
];
