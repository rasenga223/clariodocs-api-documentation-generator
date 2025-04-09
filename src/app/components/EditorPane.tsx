"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function EditorPane() {
  const [code, setCode] = useState<string>("// Write your MDX or content here\n");

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