import { treaty } from "@elysiajs/eden";
import type { App } from "daemon";

export const stardustConnector = (host: string, token: string) =>
	treaty<App>(host, {
		headers: {
			authorization: token,
		},
	});
