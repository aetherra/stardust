"use client";
import Editor, { type Monaco } from "@monaco-editor/react";
import { github_dark, latte, mocha } from "@stardust/theme/monaco";
import { Save } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { saveConfig } from "./actions";

type MonacoTheme = Parameters<Monaco["editor"]["defineTheme"]>[1];

export default function ConfigEditor({
	current,
	path,
	saved,
	restartEnabled,
}: {
	current: string;
	path: string;
	saved: boolean;
	restartEnabled: boolean;
}) {
	const { resolvedTheme } = useTheme();
	const [value, setValue] = useState<string | undefined>(current);
	return (
		<div className="flex w-full flex-col justify-center items-left -ml-2">
			<form
				className="my-2 flex flex-row items-center gap-2"
				action={(data) =>
					void toast.promise(
						async () => {
							if (!value) throw new Error("No value provided");
							const res = await saveConfig(value, Boolean(data.get("restart")));
							if (res.error) throw new Error(res.error);
							return res;
						},
						{
							loading: "Saving...",
							success: (data) =>
								data.restart
									? "Saved! Stardust will automatically restart."
									: "Saved! Rebuild and restart Stardust to apply changes.",
							error: (error) => `Failed to save: ${error}`,
						},
					)
				}
			>
				<SubmitButton>
					<Save />
					Save
				</SubmitButton>
				<div className="flex flex-row gap-2">
					{restartEnabled ? (
						<>
							<Checkbox name="restart" defaultChecked={false} />
							<Label htmlFor="restart">Restart server</Label>
						</>
					) : null}
				</div>
				<Button asChild variant="link">
					<Link
						href="https://stardust.aetherra.org/docs/install/web#configure"
						target="_blank"
						rel="noopener noreferrer"
					>
						Docs
					</Link>
				</Button>
				{saved ? <Badge>Loaded</Badge> : <Badge variant="destructive">Not loaded</Badge>}
			</form>
			<Editor
				defaultLanguage="yaml"
				className="w-fit h-[90vh] border rounded-sm p-2"
				value={value}
				onChange={setValue}
				defaultPath={path}
				options={{
					readOnly: false,
					minimap: { enabled: false },
					scrollBeyondLastLine: false,
					wordWrap: "on",
					tabSize: 2,
					insertSpaces: true,
					automaticLayout: true,
				}}
				onMount={(_, monaco) => {
					monaco.editor.defineTheme("dark", mocha as MonacoTheme);
					monaco.editor.defineTheme("light", latte as MonacoTheme);
					monaco.editor.defineTheme("zinc", github_dark as MonacoTheme);
					monaco.editor.setTheme(resolvedTheme || "dark");
				}}
			/>
		</div>
	);
}
