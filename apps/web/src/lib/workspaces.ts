import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";
import db, { workspace } from "@stardust/db";

export async function getWorkspaces() {
  const { nodes } = getConfig();
  return await Promise.all(
    (await db.select().from(workspace)).map(async (w) => {
      const nodeMetadata = await Promise.all(
        nodes.map(async (n) => {
          const { data } = await stardustConnector(n).workspaces.index.get();
          if (!data) throw new Error("No node data");
          return {
            id: n.id,
            workspaces: new Set(data.workspaces.map((w) => w.RepoTags[0]?.split(":")[0])),
          };
        }),
      );
      const availableNodes = nodeMetadata.reduce((acc: string[], n) => {
        if (n.workspaces.has(w.dockerImage)) acc.push(n.id);
        return acc;
      }, []);
      return {
        nodes: availableNodes,
        ...w,
      };
    }),
  );
}
