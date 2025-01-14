import auth from "@stardust/common/auth";
import { toNextJsHandler } from "@stardust/common/auth/lib";

export const { GET, POST } = toNextJsHandler(auth.handler);
