import { redirect } from "next/navigation";

// very very jank way - this is not getting released
async function handler() {
	return redirect("/");
}
export const [GET, POST] = Array(2).fill(handler);
