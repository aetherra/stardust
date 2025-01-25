"use client";
import { SubmitButton } from "@/components/submit-button";
import { CardContent, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authClient from "@/lib/auth-client";
import { toast } from "sonner";

export default function Page() {
	return (
		<CardContent className="m-1 w-full flex-col flex justify-center items-center">
			<CardDescription>Reset your password</CardDescription>
			<form
				className="mx-auto my-4 flex w-full flex-col items-start justify-center gap-2"
				action={(data) =>
					toast.promise(
						() => {
							const oldPassword = data.get("old-password")?.toString();
							const newPassword = data.get("new-password")?.toString();
							const confirmPassword = data.get("confirm-password")?.toString();
							const revokeOtherSessions = Boolean(data.get("revoke-others"));
							if (!oldPassword || !newPassword || !confirmPassword) throw new Error("All fields are required");
							if (newPassword !== confirmPassword) throw new Error("Passwords do not match");
							return authClient.changePassword({
								revokeOtherSessions,
								currentPassword: oldPassword,
								newPassword,
							});
						},
						{
							loading: "Setting password...",
							success: "Password set!",
							error: "Failed to set password",
						},
					)
				}
			>
				<Label htmlFor="old-password">Old Password</Label>
				<Input
					required
					id="old-password"
					type="password"
					name="old-password"
					placeholder="Old Password"
					autoComplete="current-password"
					className="w-full"
				/>
				<Label htmlFor="new-password">New Password</Label>
				<Input
					required
					minLength={8}
					id="new-password"
					type="password"
					name="new-password"
					placeholder="New Password"
					autoComplete="new-password"
					className="w-full"
				/>
				<Label htmlFor="confirm-password">Confirm Password</Label>
				<Input
					required
					minLength={8}
					id="confirm-password"
					type="password"
					name="confirm-password"
					placeholder="Confirm Password"
					autoComplete="new-password"
					className="w-full"
				/>
				<div className="flex items-center gap-2">
					<Checkbox id="revoke-others" name="revoke-others" defaultChecked />
					<Label htmlFor="revoke-others">Sign out of all other devices</Label>
				</div>
				<SubmitButton className="w-full">Reset</SubmitButton>
			</form>
		</CardContent>
	);
}
