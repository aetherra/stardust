"use client";
import type { SelectWorkspace } from "@stardust/db";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSession } from "@/lib/session/create";
export function CreateForm({ workspace }: { workspace: SelectWorkspace & { nodes: string[] } }) {
	const router = useRouter();
	return (
		<DialogContent className="flex md:flex-col flex-row justify-center gap-3">
			<form
				action={async (form) => {
					const { error, data } = (await createSession(workspace.dockerImage, form.get("node_id")?.toString())) || {};
					if (error || !data) {
						toast.error(error || "Failed to create session");
					} else {
						toast.success("Session created successfully!");
						router.push(`/view/${data.id}`);
					}
				}}
			>
				<DialogHeader>
					<DialogTitle>New Session</DialogTitle>
					<DialogDescription>Would you like to launch a new {workspace.friendlyName} session?</DialogDescription>
				</DialogHeader>

				<DialogFooter className="flex justify-between mt-3">
					<Select defaultValue="autoselect" name="node_id">
						<SelectTrigger id="node_id">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="autoselect">Select best node</SelectItem>
							{workspace.nodes.map((id) => (
								<SelectItem key={id} value={id}>
									{id}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<DialogClose asChild>
						<Button type="button" variant="secondary" className="hidden md:block">
							Close
						</Button>
					</DialogClose>
					<SubmitButton>Create</SubmitButton>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
