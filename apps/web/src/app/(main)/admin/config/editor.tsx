"use client";
import Editor, { type Monaco } from "@monaco-editor/react";
import { github_dark, latte, mocha } from "@stardust/theme/monaco";
import { useTheme } from "next-themes";
type MonacoTheme = Parameters<Monaco["editor"]["defineTheme"]>[1];
export default function ConfigEditor({ current }: { current: string }) {
	const { resolvedTheme } = useTheme();
	return (
		<Editor
			defaultLanguage="yaml"
			className="w-full h-full border rounded-sm p-2"
			defaultValue={current}
			defaultPath="/config.yaml"
			options={{ readOnly: true }}
			onMount={(_, monaco) => {
				monaco.editor.defineTheme("dark", mocha as MonacoTheme);
				monaco.editor.defineTheme("light", latte as MonacoTheme);
				monaco.editor.defineTheme("zinc", github_dark as MonacoTheme);
				monaco.editor.setTheme(resolvedTheme || "dark");
			}}
		/>
	);
}
