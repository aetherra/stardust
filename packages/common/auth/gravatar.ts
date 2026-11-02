import { createHash } from "node:crypto";

export const fromEmail = (email: string) =>
	`https://gravatar.com/avatar/${createHash("sha256")
		.update(email || "")
		.digest("hex")}?d=identicon&s=128`;
