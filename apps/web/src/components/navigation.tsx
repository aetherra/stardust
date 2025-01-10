"use client";
import packageJson from "@/../package.json";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SessionSchema } from "@stardust/common/auth";
import {
	Book,
	ComputerIcon,
	Globe,
	Info,
	Key,
	LogOut,
	Monitor,
	Settings,
	Sparkles,
	SwatchBook,
	Trash,
} from "lucide-react";
import type { Route } from "next";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import { GitHubIcon } from "./icons";

export default function Navigation({
	session,
}: {
	session: SessionSchema | null;
}) {
	const { name, email, image } = session?.user || {};
	const isAdmin = session?.user.role === "admin";
	const [open, setDialogOpen] = useState(false);
	const { themes, setTheme, theme: currentTheme } = useTheme();
	const pathname = usePathname();
	const navigationItems: {
		icon: React.ReactNode;
		label: string;
		href: Route;
		adminOnly?: boolean;
	}[] = [
		{
			icon: <Monitor />,
			label: "Sessions",
			href: "/sessions",
		},
		{
			label: "Admin",
			// @ts-expect-error this will be fixed soon
			href: "/admin",
			icon: <Settings />,
			adminOnly: true,
		},
	];
	const projectsUsed = [
		{
			name: "Next.js",
			url: "https://nextjs.org/",
		},
		{
			name: "Docker",
			url: "https://www.docker.com/",
		},
		{
			name: "noVNC",
			url: "https://github.com/noVNC/noVNC",
		},
		{
			name: "shadcn/ui",
			url: "https://ui.shadcn.com/",
		},
		{
			name: "better-auth",
			url: "https://better-auth.com/",
		},
	];
	return (
		<nav className="flex h-16 min-w-full items-center justify-between px-4 border-b">
			<div className="flex items-center gap-2">
				<Sparkles className="size-6" />
				<span className="text-2xl font-bold md:block hidden mr-2">Stardust</span>
			</div>
			<div className="flex justify-end gap-2">
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<Link href="/" legacyBehavior passHref>
								<NavigationMenuLink className={cn(navigationMenuTriggerStyle(), pathname === "/" && "bg-muted")}>
									<span className="mr-2 flex size-4 items-center justify-center">
										<ComputerIcon />
									</span>{" "}
									Workspaces
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						{navigationItems.map((item) => (
							<Fragment key={item.href}>
								{!item.adminOnly || (item.adminOnly && isAdmin) ? (
									<NavigationMenuItem key={item.href}>
										<Link href={item.href} legacyBehavior passHref>
											<NavigationMenuLink
												className={cn(navigationMenuTriggerStyle(), pathname.startsWith(item.href) && "bg-muted")}
											>
												<span className="mr-2 flex size-4 items-center justify-center">{item.icon}</span> {item.label}
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
								) : null}
							</Fragment>
						))}
					</NavigationMenuList>
				</NavigationMenu>
				<Dialog open={open} onOpenChange={setDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className="m-2 flex items-center justify-center text-center text-2xl text-foreground">
								<Sparkles className="mr-2 flex size-6 flex-row" />
								Stardust {packageJson.version}
							</DialogTitle>
						</DialogHeader>
						<div className="flex flex-col items-start justify-start gap-2 text-foreground text-sm">
							Stardust is the platform for streaming isolated desktop containers.
							<br />
							Stardust uses the following things in an important way:
							<br />
							<ul className="list-inside list-disc">
								{projectsUsed.map((project) => (
									<li key={project.name}>
										<a
											href={project.url}
											className="inline font-medium text-primary underline-offset-4 hover:underline"
											target="_blank"
											rel="noreferrer nopener"
										>
											{project.name}
										</a>
									</li>
								))}
							</ul>
							Copyleft 2024 Spaceness.
							<section>
								This version of Stardust is from commit{" "}
								<a
									href={`https://github.com/spaceness/stardust/commit/${process.env.GIT_COMMIT}`}
									className="inline font-medium text-primary underline-offset-4 hover:underline"
									target="_blank"
									rel="noreferrer nopener"
								>
									{process.env.GIT_COMMIT?.slice(0, 7)}
								</a>
								, built on {new Date(Number(process.env.BUILD_DATE)).toLocaleString()}
							</section>
							<DialogFooter>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button asChild variant="outline" size="icon">
											<a href="https://github.com/spaceness/stardust" target="_blank" rel="noreferrer nopener">
												<GitHubIcon className="size-5" />
											</a>
										</Button>
									</TooltipTrigger>
									<TooltipContent>Github</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="outline" size="icon" asChild>
											<a href="https://stardust-docs.vercel.app/docs" target="_blank" rel="noreferrer nopener">
												<Book className="size-5" />
											</a>
										</Button>
									</TooltipTrigger>
									<TooltipContent>Documentation</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="outline" size="icon" asChild>
											<a href="https://stardust-docs.vercel.app/" target="_blank" rel="noreferrer nopener">
												<Globe className="size-5" />
											</a>
										</Button>
									</TooltipTrigger>
									<TooltipContent>Spaceness</TooltipContent>
								</Tooltip>
							</DialogFooter>
						</div>
					</DialogContent>
				</Dialog>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar>
							<AvatarImage src={image || ""} alt={name || email || "Profile Picture"} />
							<AvatarFallback>{name ? name?.charAt(0) + name?.charAt(1) : email?.charAt(0)}</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="mr-4 mt-4 w-48">
						<DropdownMenuLabel className="flex flex-col">
							<span className="flex flex-row items-center justify-between gap-1">
								<p className="text-lg">{name || email?.split("@")[0]}</p>
								{isAdmin ? (
									<span className="flex items-center justify-center rounded-lg bg-primary px-2 py-[1px] text-xs font-bold text-primary-foreground">
										Admin
									</span>
								) : null}
							</span>
							<p className="text-xs font-light text-muted-foreground">{email}</p>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<SwatchBook className="size-4 mr-2" />
								<span>Theme</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuRadioGroup value={currentTheme} onValueChange={setTheme}>
										{themes.map((theme) => (
											<DropdownMenuRadioItem key={theme} value={theme}>
												{theme.charAt(0).toUpperCase() + theme.slice(1)}
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
						<DropdownMenuItem onClick={() => setDialogOpen((prev) => !prev)}>
							<Info className="size-4 mr-2" />
							<span>About Stardust</span>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/auth/delete">
								<Trash className="size-4 mr-2" />
								<span>Delete Account</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/auth/signout">
								<LogOut className="size-4 mr-2" />
								<span>Log Out</span>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</nav>
	);
}
