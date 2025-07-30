import type auth from "@stardust/common/auth";
import { adminClient, createAuthClient, genericOAuthClient, inferAdditionalFields } from "@stardust/common/auth/lib";

const authClient = createAuthClient({
	plugins: [inferAdditionalFields<typeof auth>(), adminClient(), genericOAuthClient()],
});
export default authClient;
