"use client";

import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  setCode: (val: string) => void;
  view: "split" | "editor" | "preview";
};

export default function EditorPane({ code, setCode, view }: Props) {
  return (
    <div
      className={`h-full border-r overflow-hidden bg-gray-50 dark:bg-gray-900 ${
        view === "split" ? "w-1/2" : "w-full"
      }`}
    >
      <Editor
        height="100%"
        defaultLanguage="markdown"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          fontSize: 14,
          padding: { top: 10 },
        }}
      />
    </div>
  );
}
