"use client";

import { DEFAULT_MDX_CONTENT } from "@/app/(dashboard)/editor/DefaultContent";
import PreviewPane from "@/components/PreviewPane";

export default function DefaultPage() {
  // Render the default content in the PreviewPane with full width
  return (
    <div className="h-screen bg-background">
      <PreviewPane 
        code={DEFAULT_MDX_CONTENT} 
        view="preview" 
      />
    </div>
  );
}