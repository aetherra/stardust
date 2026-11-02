"use client";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import Editor, { type Monaco } from "@monaco-editor/react";
import { github_dark, latte, mocha } from "@stardust/theme/monaco";
import { Book, Check, Save } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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
  const configFormRef = useRef<HTMLFormElement>(null);
  const { resolvedTheme } = useTheme();
  const [value, setValue] = useState<string | undefined>(current);

  useEffect(() => {
    const keybindHandler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        configFormRef.current?.requestSubmit();
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d") {
        event.preventDefault();
        window.open("https://stardust.aetherra.org/docs/install/web#configure");
      }
    }

    window.addEventListener("keydown", keybindHandler)

    return () => { window.removeEventListener("keydown", keybindHandler) }
  }, [])

  return (
    <div className="flex w-full flex-col justify-center items-left -ml-2">
      <form
        ref={configFormRef}
        className="my-2 flex flex-row items-center gap-1"
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
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <SubmitButton>
              <Save />
              Save <Kbd className="bg-transparent text-primary-foreground/75">Ctrl + S</Kbd>
            </SubmitButton>
            <div className="flex flex-row gap-2">
              {restartEnabled ? (
                <>
                  <Checkbox name="restart" defaultChecked={false} />
                  <Label htmlFor="restart">Restart server</Label>
                </>
              ) : null}
            </div>
            <Button asChild variant="secondary">
              <Link
                href="https://stardust.aetherra.org/docs/install/web#configure"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Book />
                Docs <Kbd className="bg-transparent text-secondary-foreground/75">Ctrl + D</Kbd>
              </Link>
            </Button>
          </div>

          <div>
            {saved ? (
              <Badge>
                <Check /> Loaded
              </Badge>
            ) : (
              <Badge variant="destructive">Not loaded</Badge>
            )}
          </div>
        </div>
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
