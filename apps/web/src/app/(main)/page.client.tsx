"use client";
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
import type { SelectWorkspace } from "@stardust/db";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function CreateForm({ workspace, nodeIds }: { workspace: SelectWorkspace; nodeIds: string[] }) {
	const router = useRouter();
	return (
		<DialogContent className="flex md:flex-col flex-row justify-center gap-3">
			<form
				action={async (data) => {
					const session = await createSession(workspace.dockerImage, data.get("node_id")?.toString()).catch(() => {
						toast.error("Error creating session");
					});
					if (!session) return;
					router.push(`/view/${session[0].id}`);
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
							{nodeIds.map((id) => (
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
