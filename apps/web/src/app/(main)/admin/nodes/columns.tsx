"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { stardustConnector } from "@stardust/common/daemon/client";
import type { NodeConfig } from "@stardust/config/config";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
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
		accessorKey: "health.version",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Version" />,
	},
	{
		accessorKey: "health.cpu",
		header: ({ column }) => <DataTableColumnHeader column={column} title="CPU" />,
		cell: ({ row }) => `${row.original.health?.cpu}%`,
	},
	{
		accessorKey: "health.mem",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Memory" />,
		cell: ({ row }) => `${row.original.health?.mem}%`,
	},
	{
		accessorKey: "health.os",
		header: ({ column }) => <DataTableColumnHeader column={column} title="OS" />,
	},
	{
		id: "url",
		header: "URL",
		cell: ({
			row: {
				original: { proto, hostname, port },
			},
		}) => `${proto || "http"}://${hostname || "0.0.0.0"}:${port || 4000}`,
	},
	{
		accessorKey: "sessions",
		accessorFn: (row) => row.sessions?.length,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Sessions" />,
		cell: ({ row }) => (
			<Popover>
				<PopoverTrigger className="text-primary hover:underline underline-offset-2 font-medium">
					{row.original.sessions?.length}
				</PopoverTrigger>
				<PopoverContent>
					{row.original.sessions?.map((session) => (
						<div key={session.Id} className="text-sm">
							{session.Id}
						</div>
					))}
				</PopoverContent>
			</Popover>
		),
	},
	{
		accessorKey: "workspaces",
		accessorFn: (row) => row.workspaces?.length,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Workspaces" />,
		cell: ({ row }) => (
			<Popover>
				<PopoverTrigger className="text-primary hover:underline underline-offset-2 font-medium">
					{row.original.workspaces?.length}
				</PopoverTrigger>
				<PopoverContent>
					{row.original.workspaces?.map((workspace) => (
						<div key={workspace.RepoTags[0]} className="text-sm">
							{workspace.RepoTags[0]}
						</div>
					))}
				</PopoverContent>
			</Popover>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.token)}>
						Copy token
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={`/daemon-api/${row.original.id}`}>API Client</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
