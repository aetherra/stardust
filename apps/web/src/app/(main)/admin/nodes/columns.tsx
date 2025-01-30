"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import type { stardustConnector } from "@stardust/common/daemon/client";
import type { NodeConfig } from "@stardust/config/config";
import type { ColumnDef } from "@tanstack/react-table";
export const columns: ColumnDef<
	NodeConfig & {
		health: Awaited<ReturnType<ReturnType<typeof stardustConnector>["healthcheck"]["get"]>>["data"];
		sessions?: NonNullable<
			Awaited<ReturnType<ReturnType<typeof stardustConnector>["sessions"]["list"]["get"]>>["data"]
		>["containers"];
		workspaces?: NonNullable<
			Awaited<ReturnType<ReturnType<typeof stardustConnector>["workspaces"]["index"]["get"]>>["data"]
		>["workspaces"];
	}
>[] = [
	{
		accessorKey: "id",
		header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
	},
	{
		accessorKey: "health.cpu",
		header: ({ column }) => <DataTableColumnHeader column={column} title="CPU load" />,
		cell: ({ row }) => `${row.original.health?.cpu}%`,
	},
	{
		accessorKey: "health.mem",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Memory usage" />,
		cell: ({ row }) => `${row.original.health?.mem}%`,
	},
	{
		accessorKey: "health.os",
		header: ({ column }) => <DataTableColumnHeader column={column} title="OS" />,
	},
	{
		accessorKey: "sessions",
		accessorFn: (row) => row.sessions?.length,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Sessions" />,
		cell: ({ row }) => row.original.sessions?.length,
	},
	{
		accessorKey: "workspaces",
		accessorFn: (row) => row.workspaces?.length,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Workspaces" />,
		cell: ({ row }) => row.original.workspaces?.length,
	},
];
