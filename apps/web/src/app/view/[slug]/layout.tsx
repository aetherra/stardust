import { getNode } from "@/lib/session/client";
import getSession from "@/lib/session/get-session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SWRConfig } from "swr";
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const params = await props.params;
	const session = await getSession(params.slug);
	return {
		title: session ? `Session ${params.slug.slice(0, 6)}` : "Invalid Session",
	};
}
export default async function ViewLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const session = await getSession(slug);
	if (!session) notFound();
	const nodeSession = getNode(session).sessions({ id: session.id });
	const { data: info, error: infoError } = await nodeSession.get();
	const { data: files, error: filesError } = await nodeSession.files.list.get();
	if (!info?.State.Running) await nodeSession.patch({ action: "start" });
	if (info?.State.Paused) await nodeSession.patch({ action: "unpause" });
	return (
		<SWRConfig
			value={{
				fallback: {
					[`/api/session/${slug}`]: {
						exists: true,
						error: infoError,
						password: info?.password,
					},
					[`/api/session/${slug}/files`]: filesError || !files.success ? filesError : files.list,
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
