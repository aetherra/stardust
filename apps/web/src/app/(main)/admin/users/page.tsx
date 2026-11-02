import auth from "@stardust/common/auth";
import { fromEmail } from "@stardust/common/auth/gravatar";
import db from "@stardust/db";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DataRefresh from "@/components/data-refresh";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { columns } from "./columns";
export const metadata: Metadata = {
	title: "Users",
};
export default async function AdminPage() {
	const data = await db.query.user.findMany({
		with: {
			session: true,
		},
	});
	return (
		<>
			<h1 className="py-6 text-3xl font-bold">Users</h1>
			<section className="-ml-4 sm:-ml-8">
				<DataTable data={data} columns={columns} filter={{ key: "email", placeholder: "Filter by email" }} />
			</section>
			<div className="flex justify-start items-center">
				<Dialog>
					<DialogTrigger asChild>
						<Button className="ml-2">Add User</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add User</DialogTitle>
							<DialogDescription>The user will automatically be added after you click Save.</DialogDescription>
						</DialogHeader>
						<form
							action={async (data) => {
								"use server";
								const email = data.get("email")?.toString();
								const name = data.get("name")?.toString();
								let image = data.get("image")?.toString();
								const password = data.get("password")?.toString();
								const role = data.get("role")?.toString() || "user";
								if (!email || !name || !password) throw new Error("Email, password, and name are required");
								if (image === "gravatar") {
									image = fromEmail(email);
								}
								await auth.api.createUser({
									body: {
										email,
										name,
										password,
										role: role as "user" | "admin",
										data: { image },
									},
									headers: await headers(),
								});
								redirect("/admin/users");
							}}
							className="flex flex-col gap-2 w-full"
						>
							<Label htmlFor="name">Name</Label>
							<Input id="name" type="text" name="name" required />
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" name="email" required />
							<Label htmlFor="image">Image</Label>
							<Input id="image" type="text" name="image" placeholder="type `gravatar` to set based on user email" />
							<Label htmlFor="password">Password</Label>
							<Input minLength={8} id="password" type="password" name="password" required />
							<Label htmlFor="role">Role</Label>
							<Select required name="role" defaultValue="user">
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
			</div>
			<DataRefresh />
		</>
	);
}
