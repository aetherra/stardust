"use client";
import type { SelectWorkspaceRelation } from "@stardust/db/relational-types";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const columns: ColumnDef<SelectWorkspaceRelation>[] = [
	{
		accessorKey: "friendlyName",
		header: "Name",
	},
	{
		accessorKey: "dockerImage",
		header: "Docker Image",
	},
	{
		accessorKey: "category",
		header: "Category",
	},
	{
		accessorKey: "nodes",
		header: "Available Nodes",
	},
	{
		accessorKey: "icon",
		header: "Icon",
		cell: ({ row }) => (
			<Image className="h-12 w-12" alt={row.original.friendlyName} src={row.original.icon} width={48} height={48} />
		),
	},
];
