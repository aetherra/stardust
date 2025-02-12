"use server";

import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";
import type { NodeConfig } from "@stardust/config/config";

export async function getBestNode(workspace: string) {
  const { nodes: configNodes } = getConfig();
  const nodes: Record<number, number> = {};
  const availableNodes = (
    await Promise.all(
      configNodes.map(async (n) => {
        const { data } = await stardustConnector(n).workspaces.index.get();
        if (!data) throw new Error("No node data");
        return {
          id: n.id,
          workspaces: data.workspaces.map((w) => w.RepoTags[0]?.split(":")[0]),
        };
      }),
    )
  )
    .filter((n) => n.workspaces.includes(workspace))
    .map((d) => d.id);
  if (availableNodes.length <= 0) throw new Error("No node with the selected workspace found");
  await Promise.all(
    configNodes
      .filter(({ id }) => availableNodes.includes(id))
      .map(async (n: NodeConfig, i) => {
        const { data } = await stardustConnector(n).healthcheck.get();
        nodes[i] = Number(data?.cpu);
      }),
  );
  console.log(nodes);
  return Object.keys(nodes)
    .map(Number)
    .find((key) => nodes[key] === Math.min(...Object.values(nodes))) as number; // shoot me
}
