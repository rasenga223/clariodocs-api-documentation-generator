type Props = {
  view: "split" | "editor" | "preview";
  setView: (val: "split" | "editor" | "preview") => void;
  history: { code: string; timestamp: string }[];
  revertToVersion: (versionIndex: number) => void;
  saveVersion: () => void; // Add saveVersion here
};

export default function EditorHeader({ view, setView, history, revertToVersion, saveVersion }: Props) {
  const toggleView = () => {
    const next = view === "split" ? "editor" : view === "editor" ? "preview" : "split";
    setView(next);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold">Editor</h1>
      <div className="space-x-3">
        <button
          onClick={saveVersion} // Call saveVersion on Save
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

      {/* Version History Dropdown */}
      {history.length > 0 && (
        <div className="relative">
          <button className="bg-gray-300 dark:bg-gray-700 px-4 py-1 rounded">
            Version History
          </button>
          <ul className="absolute right-0 bg-white dark:bg-gray-800 shadow-lg rounded-md mt-2 w-48">
            {history.map((commit, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => revertToVersion(index)}
              >
                {new Date(commit.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
