"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import EditorHeader from "./components/EditorHeader";
import EditorPane from "./components/EditorPane";
import PreviewPane from "./components/PreviewPane";

export default function HomePage() {
  const [code, setCode] = useState("# Hello MDX\n\nWrite your content here.");
  const [view, setView] = useState<"split" | "editor" | "preview">("split");

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <EditorHeader view={view} setView={setView} />
        <div className="flex flex-1 overflow-hidden">
          {(view === "split" || view === "editor") && (
            <EditorPane code={code} setCode={setCode} view={view} />
          )}
          {(view === "split" || view === "preview") && (
            <PreviewPane code={code} view={view} />
          )}
        </div>
      </div>
    </div>
  );
}
