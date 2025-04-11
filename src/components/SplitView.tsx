import { useState } from "react";
import EditorPane from "./EditorPane";
import PreviewPane from "./PreviewPane";

export default function SplitView() {
  const [code, setCode] = useState("");

  return (
    <div className="flex flex-1 overflow-hidden border-t bg-background border-border">
      <EditorPane code={code} setCode={setCode} view="split" />
      <PreviewPane code={code} view="split" />
    </div>
  );
}
