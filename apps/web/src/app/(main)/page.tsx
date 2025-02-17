import { CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getWorkspaces } from "@/lib/workspaces";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { CreateForm } from "./page.client";

export default async function Dashboard() {
	const workspaces = await getWorkspaces();
	return (
		<div className="m-auto flex w-full flex-col p-4">
			<h1 className="text-3xl font-bold mb-6">Workspaces</h1>
			<section className="flex flex-wrap gap-4">
				<Suspense fallback={<Loader2 size={64} className="animate-spin" />}>
					{workspaces.length ? (
						workspaces.map((workspace) => (
							<Dialog key={workspace.dockerImage}>
								<DialogTrigger>
									<div className="relative w-56 h-32 rounded-lg overflow-hidden shadow-lg bg-accent/40 group">
										<Image
											src={workspace.icon}
											alt={workspace.friendlyName}
											fill
											className="object-scale-down group-hover:scale-105 duration-200"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-accent/90 to-transparent" />
										<div className="absolute bottom-2 left-3 text-foreground flex flex-col">
											<h3 className="text-lg font-bold">{workspace.friendlyName}</h3>
											<p className="text-left text-sm text-muted-foreground">{workspace.category}</p>
										</div>
									</div>
								</DialogTrigger>
								<CreateForm workspace={workspace} />
							</Dialog>
						))
					) : (
						<div className="flex items-center justify-center flex-col w-full h-full p-24">
							<CardTitle className="text-lg text-foreground">No workspaces found</CardTitle>
							<p className="text-xs text-muted-foreground">Ask an adminstrator to add workspaces to this instance!</p>
						</div>
					)}
				</Suspense>
			</section>
		</div>
	);
}
