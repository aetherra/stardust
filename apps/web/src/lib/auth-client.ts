import { createAuthClient } from "better-auth/react";

const client = createAuthClient();
export type Session = typeof client.$Infer.Session;
export default client;
