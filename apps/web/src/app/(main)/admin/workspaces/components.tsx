"use client";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetcher } from "@/lib/utils";
import type { SelectWorkspace } from "@stardust/db";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import { deleteImageFromNode, pullOnNode, updateWorkspace } from "./actions";
export interface Props {
	workspace: SelectWorkspace;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	open: boolean;
}
const statesMap = {
	pulled: "Pulled",
	"in-progress": "Pulling",
	failed: "Pull Failed",
	"not-touched": "Image not modified",
};
export function UpdateDialog({ workspace, open, setOpen }: Props) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Edit {workspace.friendlyName} ({workspace.dockerImage})
					</DialogTitle>
				</DialogHeader>
				<form action={updateWorkspace} className="flex flex-col gap-2 w-full">
					<input hidden readOnly value={workspace?.dockerImage} name="dockerImage" />
					<Label htmlFor="name">Name</Label>
					<Input
						defaultValue={workspace.friendlyName}
						id="name"
						placeholder="Name"
						name="friendlyName"
						minLength={2}
						required
					/>
					<Label htmlFor="cat">Category (comma seperated)</Label>
					<Input
						defaultValue={workspace?.category?.join(", ")}
						id="cat"
						placeholder="Category"
						name="category"
						required
					/>
					<Label htmlFor="icon">Icon</Label>
					<Input defaultValue={workspace?.icon} id="icon" placeholder="Icon URL" name="icon" required />
					<SubmitButton>Save</SubmitButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
export function NodeDialog({ workspace, open, setOpen }: Props) {
	const {
		data: nodeWorkspaces,
		mutate,
		isLoading,
		isValidating,
	} = useSWR<{ id: string; status: string; pulled: boolean }[]>(
		`/api/admin/workspaces/pull-status?image=${encodeURIComponent(workspace.dockerImage)}`,
		fetcher,
		{
			refreshInterval: 10000,
		},
	);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Manage nodes for {workspace.friendlyName} ({workspace.dockerImage})
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-2 w-full">
					{nodeWorkspaces?.map((nodeWorkspace) => {
						return (
							<Card key={nodeWorkspace.id}>
								<CardHeader className="-mb-4">
									<CardTitle className="text-xl">{nodeWorkspace.id}</CardTitle>
									<CardDescription>{nodeWorkspace.pulled ? "Pulled" : "Not pulled"}</CardDescription>
								</CardHeader>
								{/* broken */}
								<CardContent className="flex flex-col gap-2">
									Pull Status: {statesMap[nodeWorkspace.status as keyof typeof statesMap]}
									{nodeWorkspace.pulled ? (
										<Button
											variant="destructive"
											onClick={() =>
												toast.promise(
													async () => {
														const promise = await deleteImageFromNode(workspace, nodeWorkspace.id);
														mutate();
														return promise;
													},
													{
														loading: "Removing from node",
														success: "Removed from node",
														error: "Failed to remove from node",
													},
												)
											}
										>
											Remove from node
										</Button>
									) : (
										<Button
											variant="default"
											disabled={nodeWorkspace.status === "in-progress"}
											onClick={() =>
												toast.promise(() => pullOnNode(workspace, nodeWorkspace.id), {
													loading: "Requesting image pull on node",
													success: "Pull requested on node",
													error: "Failed to pull on node",
												})
											}
										>
											Add to node
										</Button>
									)}
								</CardContent>
							</Card>
						);
					})}
				</div>
				<DialogFooter className="justify-start flex items-center">
					{isLoading || isValidating ? <Loader2 className="animate-spin" /> : null}
					<Button variant="default" onClick={() => mutate()}>
						Refresh
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
