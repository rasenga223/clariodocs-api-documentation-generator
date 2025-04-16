import Link from "next/link";

export function HeaderLogo() {
  return (
    <div className="col-start-2 flex items-center">
      <Link
        href="/"
        className="rounded-md px-2 py-1 text-white focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
      >
        <span className="sr-only">Clario - Return to homepage</span>
        Clario
      </Link>
    </div>
  );
}
