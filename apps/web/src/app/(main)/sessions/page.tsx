import { SubmitButton } from "@/components/submit-button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { inspectSession } from "@/lib/session/inspect";
import { type SessionAction, deleteSession, manageSession } from "@/lib/session/manage";
import auth from "@stardust/common/auth";
import db, { type SelectSession } from "@stardust/db";
import { Container, Loader2, PauseCircle, PlayCircle, ScreenShare, Square, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SessionDate } from "./session-date";
const ManageSessionButton = ({
	session: { id },
	action,
	redirectToView,
	icon,
}: {
	session: SelectSession;
	action: SessionAction;
	redirectToView?: boolean;
	icon: React.ReactNode;
}) => (
	<form
		action={async () => {
			"use server";
			await manageSession({ id, action, revalidate: !redirectToView ? "/sessions" : undefined });
			if (redirectToView) redirect(`/view/${id}`);
		}}
	>
		<Tooltip>
			<TooltipTrigger asChild>
				<SubmitButton variant="ghost" size="icon" pendingSpinner className="[&_svg]:size-6">
					{icon}
				</SubmitButton>
			</TooltipTrigger>
			<TooltipContent>
				<p>{action.charAt(0).toUpperCase() + action.slice(1)}</p>
			</TooltipContent>
		</Tooltip>
	</form>
);
export default async function Dashboard() {
	const userSession = await auth.api.getSession({ headers: await headers() });
	const sessions = await db.query.session.findMany({
		with: {
			workspace: true,
		},
		where: (users, { eq }) => eq(users.userId, userSession?.user.id as string),
	});
	const containerStates = await Promise.all(sessions.map(inspectSession));
	return (
		<div className="m-auto flex w-full flex-col p-4">
			<h1 className="text-3xl font-bold mb-6">Sessions</h1>
			<section className="flex flex-wrap gap-1">
				<Suspense fallback={<Loader2 size={64} className="animate-spin" />}>
					{sessions.length ? (
						sessions.map((session, key) => {
							const { State } = containerStates[key];
							const expiresAt = new Date(session.expiresAt);
							return (
								<div key={session.id} className="flex w-64 flex-col rounded-lg border">
									<div className="flex h-11 w-full items-center justify-between rounded-t-lg bg-card px-4 font-semibold">
										<Tooltip>
											<TooltipTrigger className="flex flex-row">
												<Image
													className="h-6 w-6 rounded-full mr-2"
													height={6}
													width={6}
													src={session.workspace.icon}
													alt={session.workspace.friendlyName}
												/>
												<Link className="flex items-center gap-4" href={`/view/${session.id}`}>
													{session.workspace.friendlyName}{" "}
													<span className="font-mono text-xs font-thin text-muted-foreground">
														{session.id.slice(0, 6)}
													</span>
												</Link>
											</TooltipTrigger>
											<TooltipContent>
												<SessionDate expiresAt={expiresAt} />
											</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger asChild>
												<form
													action={async () => {
														"use server";
														await deleteSession({ id: session.id });
														revalidatePath("/sessions");
													}}
												>
													<SubmitButton
														className="h-6 w-6 hover:bg-destructive hover:text-background"
														size="icon"
														variant="ghost"
														pendingSpinner
													>
														<Trash2 className="h-4 w-4" />
													</SubmitButton>
												</form>
											</TooltipTrigger>
											<TooltipContent className="font-normal">Delete Session</TooltipContent>
										</Tooltip>
									</div>
									<div className="flex justify-center w-full p-0">
										<AspectRatio ratio={16 / 9}>
											{!State.Paused && State.Running ? (
												<Image
													src={`/api/session/${session.id}/preview`}
													sizes="6.5rem 13rem"
													alt=""
													fill
													className="object-fill outline-hidden rounded-none md:h-[6.5rem] md:w-[13rem] h-[3.25rem] w-[6.5rem]"
												/>
											) : (
												<div className="flex items-center justify-center rounded-sm bg-muted h-36 w-full">
													<Container size={64} className="text-muted-foreground" />
												</div>
											)}
										</AspectRatio>
									</div>
									<div className="flex h-14 w-full items-center justify-evenly rounded-b-lg bg-card px-4">
										{State.Running ? (
											<>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button size="icon" variant="ghost" asChild>
															<Link href={`/view/${session.id}`}>
																<ScreenShare />
															</Link>
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p>Connect</p>
													</TooltipContent>
												</Tooltip>
												<ManageSessionButton
													action={State.Paused ? "unpause" : "pause"}
													redirectToView={State.Paused}
													icon={State.Paused ? <PlayCircle /> : <PauseCircle />}
													session={session}
												/>
											</>
										) : null}
										<ManageSessionButton
											action={State.Running ? "stop" : "start"}
											redirectToView={!State.Running}
											icon={State.Running ? <Square className="text-destructive" /> : <PlayCircle />}
											session={session}
										/>
									</div>
								</div>
							);
						})
					) : (
						<div className="flex items-center justify-center flex-col w-full h-full p-24">
							<CardTitle className="text-lg text-foreground">No sessions found</CardTitle>
							<p className="text-xs text-muted-foreground">Start a new session to see it here</p>
						</div>
					)}
				</Suspense>
			</section>
		</div>
	);
}
