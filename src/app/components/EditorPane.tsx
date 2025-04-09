"use client";

// import { useState } from "react";
import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  setCode: (val: string) => void;
};

export default function EditorPane({ code, setCode }: Props) {
  return (
    <div className="w-1/2 h-full border-r overflow-hidden bg-gray-50 dark:bg-gray-900">
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