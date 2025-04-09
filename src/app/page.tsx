"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import EditorHeader from "./components/EditorHeader";
import EditorPane from "./components/EditorPane";
import PreviewPane from "./components/PreviewPane";

export default function HomePage() {
  const [code, setCode] = useState<string>("# Hello MDX\n\nWrite your content here.");
  const [view, setView] = useState<"split" | "editor" | "preview">("split");
  const [history, setHistory] = useState<{ code: string; timestamp: string }[]>([]);

  // Load saved content and version history from localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem("mdxEditorCode");
    const savedHistory = localStorage.getItem("mdxEditorHistory");

    if (savedCode) {
      setCode(savedCode);
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save content to localStorage whenever the code changes (without adding history here)
  useEffect(() => {
    if (code) {
      localStorage.setItem("mdxEditorCode", code);
    }
  }, [code]);

  // Save version history separately
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("mdxEditorHistory", JSON.stringify(history));
    }
  }, [history]);

  // Save the current version and add it to history
  const saveVersion = () => {
    const newCommit = { code, timestamp: new Date().toISOString() };
    const updatedHistory = [newCommit, ...history];
    setHistory(updatedHistory);
  };

  // Revert to a specific version from the history
  const revertToVersion = (versionIndex: number) => {
    const selectedVersion = history[versionIndex];
    setCode(selectedVersion.code);
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <EditorHeader 
          view={view} 
          setView={setView} 
          history={history} 
          revertToVersion={revertToVersion} 
          saveVersion={saveVersion}  // Pass saveVersion here
        />
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
