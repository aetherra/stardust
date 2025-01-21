import { treaty } from "@elysiajs/eden";
import type { NodeConfig } from "@stardust/config/config";
import type { App } from "daemon";

export const stardustConnector = (node: NodeConfig) =>
  treaty<App>(`${node.proto || "http"}://${node.hostname}:${node.port || 4000}`, { // dumbass eden not letting me use port 6669
    headers: {
      authorization: node.token,
    },
  });
