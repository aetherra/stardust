import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import db, { workspace } from "@stardust/db";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { CreateSessionButton } from "./create-session-button";

export default async function Dashboard() {
	const workspaces = await db.select().from(workspace);
	return (
		<div className="m-auto flex w-full flex-col p-4">
			<h1 className="text-3xl font-bold mb-6">Workspaces</h1>
			<section className="flex flex-wrap gap-2">
				<Suspense fallback={<Loader2 size={64} className="animate-spin" />}>
					{workspaces.map((workspace) => (
						<Dialog key={workspace.dockerImage}>
							<DialogTrigger>
								<div className="relative w-64 aspect-[5/3] rounded-lg overflow-hidden shadow-lg bg-accent/40 group">
									<Image
										src={workspace.icon}
										alt={workspace.friendlyName}
										fill
										className="object-cover group-hover:scale-105 duration-200"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-accent/90 to-transparent" />
									<div className="absolute bottom-2 left-2 text-foreground flex flex-col">
										<h3 className="text-lg font-bold">{workspace.friendlyName}</h3>
										<p className="text-left text-sm text-muted-foreground">{workspace.category}</p>
									</div>
								</div>
							</DialogTrigger>
							<DialogContent className="flex md:flex-col flex-row justify-center gap-2">
								<DialogHeader>
									<DialogTitle>New Session</DialogTitle>
									<DialogDescription>
										Would you like to launch a new {workspace.friendlyName} session?
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<DialogClose asChild>
										<Button type="button" variant="secondary" className="hidden md:block">
											Close
										</Button>
									</DialogClose>
									<CreateSessionButton workspace={workspace.dockerImage} />
								</DialogFooter>
							</DialogContent>
						</Dialog>
					))}
				</Suspense>
			</section>
		</div>
	);
}
