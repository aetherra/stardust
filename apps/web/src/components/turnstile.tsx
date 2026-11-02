import { Turnstile as BaseTurnstile } from "@marsidev/react-turnstile";
import { getConfig } from "@stardust/config";
export default async function Turnstile() {
	const config = getConfig();
	if (config?.auth.turnstile?.siteKey) {
		return <BaseTurnstile siteKey={config.auth.turnstile.siteKey} />;
	}
	return null;
}
