import type { Metadata } from "next";
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const params = await props.params;
	return {
		title: `Session ${params.slug.slice(0, 6)}`,
	};
}
export default function ViewLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
