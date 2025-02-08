"use client";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Boxes, Cog, Container, Layers, LayoutDashboard, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
	const pathname = usePathname();
	const links: {
		href: Route;
		label: string;
		Icon: LucideIcon;
	}[] = [
		{ href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
		{ href: "/admin/users", label: "Users", Icon: Users },
		{ href: "/admin/nodes", label: "Nodes", Icon: Boxes },
		{ href: "/admin/workspaces", label: "Workspaces", Icon: Layers },
		{ href: "/admin/sessions", label: "Sessions", Icon: Container },
		{ href: "/admin/config", label: "Config Viewer", Icon: Cog },
	];
	return (
		<nav className="grid gap-x-4 text-sm text-muted-foreground justify-between h-full w-64">
			<section className="p-0 items-start flex flex-col gap-2 grow w-64">
				{links.map(({ href, label, Icon }) => (
					<Button
						asChild
						key={href}
						variant="ghost"
						className={cn(
							pathname === href ? "text-primary bg-secondary" : "text-muted-foreground",
							"hover:text-foreground flex gap-2 w-full justify-start",
						)}
					>
						<Link href={href}>
							<Icon className="size-5" />
							{label}
						</Link>
					</Button>
				))}
			</section>
		</nav>
	);
}
