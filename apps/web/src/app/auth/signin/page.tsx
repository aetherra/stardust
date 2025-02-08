import { SubmitButton } from "@/components/submit-button";
import Turnstile from "@/components/turnstile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import turnstileCheck from "@/lib/turnstile";
import auth from "@stardust/common/auth";
import type { BetterAuthOptions } from "@stardust/common/auth/lib";
import { getConfig } from "@stardust/config";
import { AlertCircle, IdCard, Info } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { redirect } from "next/navigation";

export default async function Login(props: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { error, message } = await props.searchParams;
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (session) redirect("/");
	const config = getConfig();
	return (
		<CardContent className="m-1 w-full flex-col flex justify-center items-center">
			<CardDescription>Login to your account</CardDescription>
			{error ? (
				<Alert variant="destructive" className="w-full text-destructive my-4">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error logging in:</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : null}
			{message ? (
				<Alert className="w-full my-4">
					<Info className="h-4 w-4" />
					<AlertTitle>{message}</AlertTitle>
				</Alert>
			) : null}
			{config.auth.credentials ? (
				<form
					className="mx-auto mb-4 flex w-full flex-col items-start justify-center gap-2"
					action={async (data) => {
						"use server";
						try {
							if (await turnstileCheck(data)) {
								const res = await auth.api.signInEmail({
									body: {
										email: data.get("email")?.toString() as string,
										password: data.get("password")?.toString() as string,
										callbackURL: "/",
									},
								});
								if (res.url) redirect(res.url);
							} else {
								throw new Error("Failed captcha");
							}
						} catch (error) {
							unstable_rethrow(error);
							redirect(`/auth/signin?error=${(error as Error).message}`);
						}
					}}
				>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						name="email"
						placeholder="Email"
						autoComplete="email"
						required
						className="w-full"
					/>
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						name="password"
						placeholder="Password"
						autoComplete="current-password"
						required
						className="w-full"
					/>
					<Turnstile />
					<SubmitButton className="w-full">Sign in</SubmitButton>
				</form>
			) : null}
			{config.auth.credentials?.signups ? (
				<Button asChild variant="link">
					<Link href="/auth/signup">Don't have an account? Sign up</Link>
				</Button>
			) : null}
			{config.auth.credentials && config.auth.oauth ? (
				<span className="text-center text-sm text-muted-foreground">Or sign in/sign up with:</span>
			) : null}
			{config.auth.oauth ? (
				<div className="mx-auto mt-4 flex w-full flex-row items-center justify-center gap-2 flex-wrap">
					{Object.keys(config.auth.oauth.providers).map((provider) => {
						return (
							<form
								key={provider}
								action={async () => {
									"use server";
									try {
										const res = await auth.api.signInSocial({
											body: {
												provider: provider as keyof BetterAuthOptions["socialProviders"],
											},
										});
										if (!res.url) throw new Error("No URL returned");
										const url = new URL(res.url);
										const { get } = await headers();
										const proto = get("x-forwarded-proto");
										const host = get("x-forwarded-host");
										const redirect_uri = new URL(url.searchParams.get("redirect_uri") as string);
										if (proto && host) {
											redirect_uri.protocol = proto;
											redirect_uri.host = host;
											redirect_uri.port = ""; // normally when those headers exist it's from behind a reverse proxy that goes to 443 or wtv the default port is
										}
										url.searchParams.set("redirect_uri", redirect_uri.href);
										redirect(url.href);
									} catch (error) {
										unstable_rethrow(error);
										redirect(`/auth/signin?error=${(error as Error).message}`);
									}
								}}
							>
								<SubmitButton variant={config.auth.credentials ? "secondary" : "default"} size="lg" className="w-32">
									<IdCard className="size-4 mr-2 shrink-0" />
									{provider.charAt(0).toLocaleUpperCase() + provider.slice(1)}
								</SubmitButton>
							</form>
						);
					})}
				</div>
			) : null}
		</CardContent>
	);
}
