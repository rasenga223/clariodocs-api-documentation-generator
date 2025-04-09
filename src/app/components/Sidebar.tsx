export default function Sidebar() {
    return (
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Docs</h2>
        <ul className="space-y-2">
          <li className="hover:underline cursor-pointer">Introduction</li>
          <li className="hover:underline cursor-pointer">Getting Started</li>
          <li className="hover:underline cursor-pointer">API Reference</li>
        </ul>
      </aside>
    );
  }