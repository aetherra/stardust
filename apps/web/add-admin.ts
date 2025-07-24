import "@stardust/config/load-config";
import { createInterface } from "node:readline/promises";
import db, { user } from "@stardust/db";
import { eq } from "@stardust/db/utils";

const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});
console.log("✨ Stardust: Starting admin addition process...");
const email = await rl.question("Enter email: ");
try {
	const res = await db.update(user).set({ role: "admin" }).where(eq(user.email, email)).returning();
	console.log(res[0].email);
} catch (error) {
	console.error("✨ Stardust: Error adding admin:", error);
	process.exit(1);
} finally {
	console.log("✨ Stardust: Admin addition process completed.");
	rl.close();
}
process.exit(0);
