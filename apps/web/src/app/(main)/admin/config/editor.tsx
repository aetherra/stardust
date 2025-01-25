"use client";
import Editor from "@monaco-editor/react";
export default function ConfigEditor({ current }: { current: string }) {
	return (
		<Editor
			defaultLanguage="yaml"
			className="size-[90vh]"
			defaultValue={current}
			theme="vs-dark"
			defaultPath="/config.yaml"
			options={{ readOnly: true }}
		/>
	);
}
