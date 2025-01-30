import { SubmitButton } from "@/components/submit-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SelectWorkspace } from "@stardust/db";
import { updateWorkspace } from "./actions";
export function UpdateDialog({
	workspace,
	open,
	setOpen,
}: {
	workspace: SelectWorkspace;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	open: boolean;
}) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Edit {workspace.friendlyName} ({workspace.dockerImage})
					</DialogTitle>
				</DialogHeader>
				<form action={updateWorkspace} className="flex flex-col gap-2 w-full">
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
					<input hidden readOnly value={workspace?.dockerImage} name="dockerImage" />
					<Label htmlFor="icon">Icon</Label>
					<Input defaultValue={workspace?.icon} id="icon" placeholder="Icon URL" name="icon" required />
					<SubmitButton>Save</SubmitButton>
				</form>
			</DialogContent>
		</Dialog>
	);
}
