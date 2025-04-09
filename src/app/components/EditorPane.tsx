export default function EditorPane() {
    return (
      <div className="w-1/2 h-full p-4 border-r overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <textarea
          className="w-full h-full bg-transparent resize-none outline-none text-base font-mono"
          placeholder="Write your MDX or content here..."
        ></textarea>
      </div>
    );
  }