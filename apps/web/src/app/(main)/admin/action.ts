"use server";

import { revalidatePath } from "next/cache";

export async function refresh(path: string) {
	return revalidatePath(path);
}
