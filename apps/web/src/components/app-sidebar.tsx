"use client";

import type { SessionSchema } from "@stardust/common/auth";
import {
	Book,
	Boxes,
	ChevronRight,
	Cog,
	ComputerIcon,
	Container,
	Globe,
	Info,
	Key,
	Layers,
	LayoutDashboard,
	LogOut,
	Monitor,
	Settings,
	SwatchBook,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import packageJson from "@/../package.json";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GitHubIcon, StardustIcon } from "./icons";

interface AppSidebarProps {
	session: SessionSchema | null;
	credentials?: boolean;
}

export function AppSidebar({ session, credentials }: AppSidebarProps) {
	const { name, email, image } = session?.user || {};
	const isAdmin = session?.user.role === "admin";
	const [open, setDialogOpen] = useState(false);
	const { themes, setTheme, theme: currentTheme } = useTheme();
	const pathname = usePathname();
	const sidebar = useSidebar();
	const mainNavItems = [
		{
			icon: ComputerIcon,
			label: "Workspaces",
			href: "/",
		},
		{
			icon: Monitor,
			label: "Sessions",
			href: "/sessions",
		},
	];

	const adminNavItems = [
		{
			icon: LayoutDashboard,
			label: "Dashboard",
			href: "/admin",
		},
		{
			icon: Users,
			label: "Users",
			href: "/admin/users",
		},
		{
			icon: Boxes,
			label: "Nodes",
			href: "/admin/nodes",
		},
		{
			icon: Layers,
			label: "Workspaces",
			href: "/admin/workspaces",
		},
		{
			icon: Container,
			label: "Sessions",
			href: "/admin/sessions",
		},
		{
			icon: Cog,
			label: "Config",
			href: "/admin/config",
		},
	];

	return (
		<>
			<Sidebar collapsible="icon">
				<SidebarHeader className="border-b  flex flex-row items-center gap-2 pr-2 py-2">
					<StardustIcon className="size-10" />
					{sidebar.open || sidebar.isMobile ? <span className="text-3xl font-bold ml-2">Stardust</span> : null}
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								{mainNavItems.map((item) => (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											asChild
											isActive={
												item.href === "/"
													? pathname === "/"
													: pathname.startsWith(item.href) && !pathname.startsWith("/admin")
											}
										>
											<Link href={item.href}>
												<item.icon className="size-4" />
												<span>{item.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					{isAdmin && (
						<SidebarGroup>
							<SidebarGroupLabel>
								<Settings className="size-4 mr-2" />
								Administration
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{adminNavItems.map((item) => (
										<SidebarMenuItem key={item.href}>
											<SidebarMenuButton
												asChild
												isActive={item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)}
											>
												<Link href={item.href}>
													<item.icon className="size-4" />
													<span>{item.label}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					)}
				</SidebarContent>
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton>
										<SwatchBook className="size-4" />
										<span>Theme</span>
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent side="right" className="w-[--radix-dropdown-menu-trigger-width]">
									<DropdownMenuRadioGroup
										value={currentTheme}
										onValueChange={setTheme}
										className="!w-[--radix-dropdown-menu-trigger-width]"
									>
										{themes.map((theme) => (
											<DropdownMenuRadioItem key={theme} value={theme}>
												{theme.charAt(0).toUpperCase() + theme.slice(1)}
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton onClick={() => setDialogOpen((prev) => !prev)}>
								<Info className="size-4" />
								<span>About Stardust</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:[&>svg]:rotate-180">
										<Avatar className="size-4 rounded-lg">
											<AvatarImage src={image || ""} alt={name || email || "Profile Picture"} />
											<AvatarFallback className="rounded-lg">
												{name ? name?.charAt(0) + name?.charAt(1) : email?.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">{name || email?.split("@")[0]}</span>
										</div>
										<ChevronRight className="ml-auto size-4" />
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" side="right">
									<DropdownMenuLabel className="p-0 font-normal">
										<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
											<Avatar className="h-8 w-8 rounded-lg">
												<AvatarImage src={image || ""} alt={name || email || "Profile Picture"} />
												<AvatarFallback className="rounded-lg">
													{name ? name?.charAt(0) + name?.charAt(1) : email?.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div className="grid flex-1 text-left text-sm leading-tight">
												<span className="truncate font-semibold">{name || email?.split("@")[0]}</span>
												<span className="truncate text-xs text-muted-foreground">{email}</span>
											</div>
											{isAdmin ? <Badge>Admin</Badge> : null}
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{credentials ? (
										<DropdownMenuItem asChild>
											<Link href="/auth/reset-password">
												<Key className="size-4" />
												<span>Reset Password</span>
											</Link>
										</DropdownMenuItem>
									) : null}
									<DropdownMenuItem asChild>
										<Link href="/auth/signout">
											<LogOut className="size-4" />
											<span>Sign Out</span>
										</Link>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
			<Dialog open={open} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="m-2 flex items-center justify-center text-center text-2xl text-foreground">
							<StardustIcon className="mr-2 size-6 rounded-[5px]" />
							Stardust {packageJson.version}
						</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col items-start justify-start gap-2 text-foreground text-sm">
						Stardust is the platform for streaming isolated desktop containers.
						{process.env.GIT_COMMIT !== "DEVELOP" ? (
							<section>
								This version of Stardust is from commit{" "}
								<a
									href={`https://github.com/aetherra/stardust/commit/${process.env.GIT_COMMIT}`}
									className="inline font-medium text-primary underline-offset-4 hover:underline"
									target="_blank"
									rel="noreferrer noopener"
								>
									{process.env.GIT_COMMIT?.slice(0, 7)}
								</a>
								, built on {new Date(Number(process.env.BUILD_DATE)).toLocaleString()}
							</section>
						) : (
							<p className="text-destructive font-bold">You are currently running Stardust in development mode.</p>
						)}
						<section>
							Stardust is licensed under the{" "}
							<a
								href="https://www.gnu.org/licenses/agpl-3.0.txt"
								target="_blank"
								rel="noreferrer noopener"
								className="inline font-medium text-primary underline-offset-4 hover:underline"
							>
								GNU Affero General Public License v3.0 (AGPL-3.0)
							</a>
							. Copyleft 2024 aetherra.
						</section>
						<DialogFooter>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button asChild variant="outline" size="icon">
										<a href="https://github.com/aetherra/stardust" target="_blank" rel="noreferrer noopener">
											<GitHubIcon className="size-5" />
										</a>
									</Button>
								</TooltipTrigger>
								<TooltipContent>Github</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="outline" size="icon" asChild>
										<a href="https://stardust.aetherra.org/docs" target="_blank" rel="noreferrer noopener">
											<Book className="size-5" />
										</a>
									</Button>
								</TooltipTrigger>
								<TooltipContent>Documentation</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="outline" size="icon" asChild>
										<a href="https://aetherra.org/" target="_blank" rel="noreferrer noopener">
											<Globe className="size-5" />
										</a>
									</Button>
								</TooltipTrigger>
								<TooltipContent>aetherra</TooltipContent>
							</Tooltip>
						</DialogFooter>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
