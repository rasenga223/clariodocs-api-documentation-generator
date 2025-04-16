import Link from "next/link";

interface PageHeaderProps {
  title: string;
  backLink: string;
}

export function PageHeader({ title, backLink }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      <Link
        href={backLink}
        className="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
      >
        Back
      </Link>
    </div>
  );
}
