type Props = {
  view: "split" | "editor" | "preview";
  setView: (val: "split" | "editor" | "preview") => void;
};

export default function EditorHeader({ view, setView }: Props) {
  const toggleView = () => {
    const next = view === "split" ? "editor" : view === "editor" ? "preview" : "split";
    setView(next);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold">Editor</h1>
      <div className="space-x-3">
        <button
          onClick={() => alert("Your content is saved automatically!")}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={toggleView}
          className="bg-gray-300 dark:bg-gray-700 px-4 py-1 rounded"
        >
          Toggle View ({view})
        </button>
        <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Export</button>
      </div>
    </header>
  );
}
