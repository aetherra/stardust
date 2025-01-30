"use client";
import Editor from "@monaco-editor/react";
import { useEffect, useRef } from "react";
export default function ConfigEditor({ current }: { current: string }) {
	return (
		<Editor
			defaultLanguage="yaml"
			className="size-[90vh]"
			defaultValue={current}
			defaultPath="/config.yaml"
			options={{ readOnly: true }}
			onMount={(editor, monaco) => {
				monaco.editor.defineTheme("catppuccin-mocha", {
					base: "vs-dark",
					inherit: true,
					rules: [
						{
							foreground: "7f849c",
							fontStyle: "italic",
							token: "comment",
						},
						{
							foreground: "a6e3a1",
							token: "string",
						},
						{
							foreground: "f38ba8",
							fontStyle: "italic",
							token: "keyword",
						},
						{
							foreground: "89b4fa",
							fontStyle: "italic",
							token: "entity.name.function",
						},
						{
							foreground: "89b4fa",
							fontStyle: "italic",
							token: "variable.function",
						},
						{
							foreground: "89dceb",
							fontStyle: "bold",
							token: "keyword.operator",
						},
						{
							foreground: "74c7ec",
							token: "entity.name.class",
						},
					],
					colors: {
						"editor.foreground": "#cdd6f4",
						"editor.background": "#1e1e2e",
						"editor.selectionBackground": "#7f849c66",
						"editor.lineHighlightBackground": "#cdd6f40b",
						"editorCursor.foreground": "#bac2de",
						"editorWhitespace.foreground": "#9399b266",
						"editor.selectionHighlightBorder": "#1e1e2e",
					},
				});

				monaco.editor.setTheme("catppuccin-mocha");
			}}
		/>
	);
}
