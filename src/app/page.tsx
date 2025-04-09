"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import EditorHeader from "./components/EditorHeader";
import EditorPane from "./components/EditorPane";
import PreviewPane from "./components/PreviewPane";

export default function HomePage() {
  const [code, setCode] = useState("# Hello MDX\n\nWrite your content here.");

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <EditorHeader />
        <div className="flex flex-1 overflow-hidden">
          <EditorPane code={code} setCode={setCode} />
          <PreviewPane code={code} />
        </div>
      </div>
    </div>
  );
}