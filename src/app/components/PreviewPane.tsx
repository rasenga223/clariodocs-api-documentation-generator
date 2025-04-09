/* eslint-disable react/display-name */
"use client";

import { useEffect, useState } from "react";
import { compileSync, runSync } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { MDXProvider } from "@mdx-js/react";

interface Props {
  code: string;
  view: "split" | "editor" | "preview";
}

export default function PreviewPane({ code, view }: Props) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    try {
      const compiled = compileSync(code, {
        outputFormat: "function-body",
      });

      const result = runSync(String(compiled), {
        ...runtime,
        baseUrl: import.meta.url,
      });

      setComponent(() => result.default);
    } catch (err) {
      console.error("MDX Compile Error:", err);
      setComponent(() => () => (
        <p className="text-red-500">
          MDX Compile Error: {(err as Error).message}
        </p>
      ));
    }
  }, [code]);

  return (
    <div
      className={`h-full p-4 overflow-y-auto bg-white dark:bg-gray-950 ${
        view === "split" ? "w-1/2" : "w-full"
      }`}
    >
      <MDXProvider>
        {Component ? <Component /> : <p className="text-gray-400">Loading preview...</p>}
      </MDXProvider>
    </div>
  );
}
