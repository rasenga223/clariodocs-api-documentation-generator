import EditorPane from "./EditorPane";
import PreviewPane from "./PreviewPane";

export default function SplitView() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <EditorPane />
      <PreviewPane />
    </div>
  );
}