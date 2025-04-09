import Sidebar from "./components/Sidebar";
import EditorHeader from "./components/EditorHeader";
import SplitView from "./components/SplitView";

export default function HomePage() {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <EditorHeader />
        <SplitView />
      </div>
    </div>
  );
}