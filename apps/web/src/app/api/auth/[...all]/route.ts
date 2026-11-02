import auth from "@stardust/common/auth";
import { toNextJsHandler } from "@stardust/common/auth/lib";
import type { NextRequest } from "next/server";
import { reqWithTrustedOrigin } from "@/lib/real-origin-req";

const handlers = toNextJsHandler(auth.handler);
export const GET = (req: NextRequest) => handlers.GET(reqWithTrustedOrigin(req));
export const POST = (req: NextRequest) => handlers.POST(reqWithTrustedOrigin(req));
