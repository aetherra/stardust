import type auth from "@stardust/common/auth";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
const client = createAuthClient({
	plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});
export default client;
