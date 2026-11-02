import { revalidatePath } from "next/cache";
import { SubmitButton } from "./submit-button";

export default function DataRefresh({ path }: { path?: string }) {
	return (
		<form
			className="mx-2 my-4"
			action={async () => {
				"use server";
				revalidatePath(path || "/admin");
			}}
		>
			<SubmitButton variant="outline" size="sm">
				Refresh
			</SubmitButton>
		</form>
	);
}
