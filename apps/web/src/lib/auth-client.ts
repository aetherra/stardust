import type auth from "@stardust/common/auth";
import { adminClient, createAuthClient, inferAdditionalFields } from "@stardust/common/auth/lib";
const authClient = createAuthClient({
	plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});
export default authClient;
