import { getConfig } from "@stardust/config";

export default async function turnstileCheck(data: FormData) {
	const config = getConfig();
	if (!config.auth.turnstile) return true;
	const key = data.get("cf-turnstile-response")?.toString();
	const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
		body: JSON.stringify({
			secret: config.auth.turnstile.secret,
			response: key,
		}),
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const outcome = await result.json();
	return outcome.success;
}
