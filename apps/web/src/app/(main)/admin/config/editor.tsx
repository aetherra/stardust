"use client";
import Editor, { type Monaco } from "@monaco-editor/react";
import { github_dark, latte, mocha } from "@stardust/theme/monaco";
import { Save } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import saveConfig from "./actions";

type MonacoTheme = Parameters<Monaco["editor"]["defineTheme"]>[1];

export default function ConfigEditor({ current, path }: { current: string; path: string }) {
	const { resolvedTheme } = useTheme();
	const [value, setValue] = useState<string | undefined>(current);

	return (
		<div className="flex h-[90vh] w-full flex-col justify-center items-left">
			<form
				className="mb-2 flex flex-row items-center"
				action={() =>
					void toast.promise(
						async () => {
							if (!value) throw new Error("No value provided");
							const res = await saveConfig(value);
							if (res.error) throw new Error(res.error);
							return res;
						},
						{
							loading: "Saving...",
							success: "Saved! Rebuild and restart Stardust to apply changes.",
							error: (error) => `Failed to save: ${error}`,
						},
					)
				}
			>
				<SubmitButton>
					<Save className="size-6 mr-2" />
					Save (manual restart and rebuild required)
				</SubmitButton>
				<Button asChild variant="link">
					<Link
						href="https://stardust.aetherra.org/docs/install/web#configure"
						target="_blank"
						rel="noopener noreferrer"
					>
						Docs
					</Link>
				</Button>
			</form>
			<Editor
				defaultLanguage="yaml"
				className="w-full border rounded-sm p-2"
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
