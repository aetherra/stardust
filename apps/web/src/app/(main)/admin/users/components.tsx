import { SubmitButton } from "@/components/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SelectUser } from "@stardust/db";
import { toast } from "sonner";
import { resetPassword, updateUser } from "./actions";

export interface Props {
	user: SelectUser;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	open: boolean;
}
export function ResetPasswordDialog({ user, open, setOpen }: Props) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Reset password for {user.name || user.email}</DialogTitle>
				</DialogHeader>
				<form
					action={(data) =>
						void toast.promise(
							async () => {
								const res = await resetPassword(user.id, data);
								if (res?.error) throw new Error(res.error);
								return res;
							},
							{
								loading: "Resetting password...",
								success: "Password reset",
								error: (error) => `Failed to reset password: ${error.message}`,
								finally: () => setOpen(false),
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
	);
}
export function UpdateUserDialog({ user, open, setOpen }: Props) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update {user.name}</DialogTitle>
				</DialogHeader>
				<form
					action={(data) =>
						void toast.promise(
							async () => {
								const res = await updateUser(user.id, data);
								if (res.error) {
									throw new Error(res.error);
								}
								return res;
							},
							{
								success: "User updated successfully",
								error: (error) => `Failed to update user: ${error.message}`,
								finally: () => setOpen(false),
							},
						)
					}
					className="flex flex-col gap-2 w-full"
				>
					<Label htmlFor="name">Name</Label>
					<Input id="name" type="text" name="name" defaultValue={user.name} required />
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" name="email" defaultValue={user.email} required />
					<Label htmlFor="image">Image</Label>
					<Input
						id="image"
						type="text"
						name="image"
						defaultValue={user.image || undefined}
						placeholder="type `gravatar` to set based on user email"
					/>
					<Label htmlFor="role">Role</Label>
					<Select required name="role" defaultValue={user.role}>
						<SelectTrigger id="role">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="user">User</SelectItem>
							<SelectItem value="admin">Admin</SelectItem>
						</SelectContent>
					</Select>
					<SubmitButton>Save</SubmitButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
