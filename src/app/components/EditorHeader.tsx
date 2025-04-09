/* eslint-disable @typescript-eslint/no-explicit-any */
import saveAs from "file-saver";
import { jsPDF } from "jspdf";

type Props = {
  view: "split" | "editor" | "preview";
  setView: (val: "split" | "editor" | "preview") => void;
  history: any[];
  revertToVersion: (index: number) => void;
  saveVersion: () => void;
  code: string;
};

export default function EditorHeader({
  view,
  setView,
  history,
  revertToVersion,
  saveVersion,
  code,
}: Props) {
  const toggleView = () => {
    const next =
      view === "split" ? "editor" : view === "editor" ? "preview" : "split";
    setView(next);
  };

  const exportMarkdown = (code: string) => {
    if (code.trim()) {
      const blob = new Blob([code], { type: "text/markdown" });
      saveAs(blob, "document.md");
    } else {
      alert("Cannot export empty content.");
    }
  };

  const exportMDX = (code: string) => {
    console.log("Code to export:", code); // Log the code value
  
    if (!code || !code.trim()) {
      alert("Cannot export empty content.");
      return;
    }
  
    const blob = new Blob([code], { type: "text/markdown" }); // MDX is essentially Markdown
    saveAs(blob, "document.mdx");
  };
  
  

  const exportJSON = (code: string) => {
    if (code.trim()) {
      const jsonContent = JSON.stringify({ content: code, timestamp: new Date().toISOString() });
      const blob = new Blob([jsonContent], { type: "application/json" });
      saveAs(blob, "document.json");
    } else {
      alert("Cannot export empty content.");
    }
  };

  // Export function for PDF
  const exportPDF = (code: string) => {
    if (code.trim()) {
      const doc = new jsPDF();

      // Split the code into lines that fit within the PDF width
      const lines = doc.splitTextToSize(code, 180); // Adjust the width based on your design

      // Add the text to the PDF starting at position (10, 10)
      doc.text(lines, 10, 10);

      // Save the PDF as 'document.pdf'
      doc.save("document.pdf");
    } else {
      alert("Cannot export empty content.");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold">Editor</h1>
      <div className="space-x-3 relative"> {/* Added relative to this div */}
        <button
          onClick={saveVersion}
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
        <div className="relative">
          <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
            Export
          </button>
          <ul className="absolute right-0 bg-white dark:bg-gray-800 shadow-lg rounded-md mt-2 w-48 z-50">
            <li
              onClick={() => exportPDF(code)} // Export as PDF
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Export as PDF
            </li>
            <li
              onClick={() => exportMarkdown(code)} // Export as Markdown
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Export as Markdown
            </li>
            <li
              onClick={() => exportMDX(code)} // Export as MDX
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Export as MDX
            </li>
            <li
              onClick={() => exportJSON(code)} // Export as JSON
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Export as JSON
            </li>
          </ul>
        </div>
      </div>

      {/* Version History Dropdown */}
      {history.length > 0 && (
        <div className="relative">
          <button className="bg-gray-300 dark:bg-gray-700 px-4 py-1 rounded">
            Version History
          </button>
          <ul className="absolute right-0 bg-white dark:bg-gray-800 shadow-lg rounded-md mt-2 w-48 z-50">
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
