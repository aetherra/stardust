"use server";

import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";

export async function getNodeWorkspaces() {
	return Promise.all(
		getConfig().nodes.map(async (n) => {
			const connector = stardustConnector(n);
			const { data } = await connector.workspaces.index.get();

			if (!data) throw new Error("No node data");
			return {
				id: n.id,
				workspaces: await Promise.all(
					data.workspaces.map(async (w) => {
						const image = w.RepoTags[0].split(":")[0];
						const { data, error } = await connector.workspaces.create.get({
							query: {
								image,
							},
						});
						if (error) throw new Error(error.value.message);
						return {
							image,
							pullState: data.status,
						};
					}),
				),
			};
		}),
	);
}
