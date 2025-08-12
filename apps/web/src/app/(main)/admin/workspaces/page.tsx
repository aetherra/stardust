import db, { workspace } from "@stardust/db";
import type { Metadata } from "next";
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
import { check } from "@/lib/admin-check";
import { getWorkspaces } from "@/lib/workspaces";
import { columns } from "./columns";
export const metadata: Metadata = {
	title: "Workspaces",
};
export default async function AdminPage() {
	const data = await getWorkspaces();
	return (
		<div className="flex h-full flex-col">
			<h1 className="py-6 text-3xl font-bold">Workspaces</h1>
			<section className="-ml-8">
				<DataTable data={data} columns={columns} />
			</section>
			<div className="flex justify-start items-center">
				<Dialog>
					<DialogTrigger asChild>
						<Button className="ml-2">Add Workspace</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Workspace</DialogTitle>
							<DialogDescription>
								This adds the Stardust workspace to the database. After adding here, you can add it to individual nodes.{" "}
							</DialogDescription>
						</DialogHeader>
						<form
							action={async (data) => {
								"use server";
								await check();
								const fields = {
									dockerImage: data.get("dockerImage")?.toString() as string,
									friendlyName: data.get("friendlyName")?.toString() as string,
									category:
										data
											.get("category")
											?.toString()
											.split(",")
											.map((cat) => cat.trim()) || [],
									icon: data.get("icon")?.toString() as string,
								};
								await db
									.insert(workspace)
									.values(fields)
									.onConflictDoUpdate({
										target: workspace.dockerImage,
										set: {
											category: fields.category,
											friendlyName: fields.friendlyName,
											icon: fields.icon,
										},
									});
								redirect("/admin/workspaces");
							}}
							className="flex flex-col gap-2 w-full"
						>
							<Label htmlFor="dockerImage">Docker Image</Label>
							<Input name="dockerImage" id="dockerImage" required />
							<Label htmlFor="name">Name</Label>
							<Input name="friendlyName" id="name" minLength={2} required />
							<Label htmlFor="cat">Category (comma seperated)</Label>
							<Input name="category" id="cat" required />
							<Label htmlFor="icon">Icon URL</Label>
							<Input id="icon" name="icon" required />
							<SubmitButton>Save</SubmitButton>
						</form>
					</DialogContent>
				</Dialog>
			</div>
			<DataRefresh />
		</div>
	);
}
