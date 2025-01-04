export async function register() {
	if (process.env.NEXT_RUNTIME !== "nodejs") return;
	const { getConfig, validateConfig } = await import("@stardust/config");
	const res = validateConfig(getConfig());
	if (!res) {
		throw new Error("Config file schema invalid");
	}
}
