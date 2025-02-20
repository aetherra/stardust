import { SubmitButton } from "@/components/submit-button";
import Turnstile from "@/components/turnstile";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import turnstileCheck from "@/lib/turnstile";
import auth from "@stardust/common/auth";
import { fromEmail } from "@stardust/common/auth/gravatar";
import { getConfig } from "@stardust/config";
import db, { user } from "@stardust/db";
import { eq } from "@stardust/db/utils";
import { Info } from "lucide-react";
import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";

export default async function Page(props: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const searchParams = await props.searchParams;
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (session) redirect("/");
	const config = getConfig();
	const { message, error } = searchParams;
	if (!config.auth.credentials || !config.auth.credentials.signups)
		redirect(`/auth/error?error=${encodeURIComponent("Signups are disabled for this instance.")}`);
	return (
		<CardContent className="m-1 w-full flex-col flex justify-center items-center">
			<CardDescription>Create an account</CardDescription>
			{message ? (
				<Alert className="w-full my-4">
					<Info className="h-4 w-4" />
					<AlertTitle>{message}</AlertTitle>
				</Alert>
			) : null}
			{error ? (
				<Alert className="w-full my-4" variant="destructive">
					<Info className="h-4 w-4" />
					<AlertTitle>{error}</AlertTitle>
				</Alert>
			) : null}
			<form
				className="mx-auto mb-4 flex w-full flex-col items-start justify-center gap-2"
				action={async (data) => {
					"use server";
					try {
						if (!(await turnstileCheck(data))) {
							redirect("/auth/signup?error=Failed%captcha");
						}
						const { userCheck, usersLength } = await db.transaction(async (tx) => ({
							userCheck: await tx.query.user.findFirst({
								where: (user, { eq }) => eq(user.email, data.get("email")?.toString() || ""),
							}),
							usersLength: await tx.$count(user),
						}));
						if (userCheck) redirect("/auth/login?error=Email%20already%20in%20use");
						const email = data.get("email")?.toString() || "";
						const name = data.get("name")?.toString() || "";
						const password = data.get("password")?.toString();
						if (
							!String(email).match(
								/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
							)
						) {
							redirect("/auth/signup?error=Bad%20email");
						}
						if (email.length > 64 || email.length < 8 || name.length > 32 || name.length < 3) {
							redirect("/auth/signup?error=Bad%20email%20or%20name");
						}
						if (!password) redirect("/auth/signup?error=Bad%20password");
						await auth.api.signUpEmail({
							body: {
								email,
								name,
								password,
								image: fromEmail(email),
							},
						});
						if (usersLength === 0) await db.update(user).set({ role: "admin" }).where(eq(user.email, email));
						redirect("/auth/signin?message=Account%20created%20successfully");
					} catch (e) {
						unstable_rethrow(e);
						throw e;
					}
				}}
			>
				<Label htmlFor="name">Name</Label>
				<Input
					id="name"
					type="text"
					name="name"
					placeholder="Name"
					autoComplete="name"
					className="w-full"
					minLength={3}
					maxLength={32}
				/>
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					name="email"
					placeholder="Email"
					autoComplete="email"
					required
					className="w-full"
					minLength={8}
					maxLength={64}
				/>
				<Label htmlFor="password">Password</Label>
				<Input
					minLength={8}
					id="password"
					type="password"
					name="password"
					placeholder="Password"
					autoComplete="new-password"
					required
					className="w-full"
				/>
				<Turnstile />
				<SubmitButton className="w-full">Sign up</SubmitButton>
			</form>
		</CardContent>
	);
}
