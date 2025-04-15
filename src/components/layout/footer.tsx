export const Footer = () => {
  return (
    <footer className="flex min-h-80 items-center bg-green-500 p-4 pb-2 text-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl justify-between gap-8 max-md:flex-col">
        <header>
          <h2 className="-mt-4 text-[clamp(3rem,5vw,7rem)] leading-none font-black uppercase">
            Clario
          </h2>
          <p className="pl-1 text-sm text-zinc-700 md:pl-4">
            © 2025 Clario. All rights reserved.
          </p>
        </header>

        <section className="flex w-full max-w-sm items-start gap-16 space-y-2 md:justify-between">
          {["Quick Links", "Application"].map((item) => (
            <div key={item}>
              <h3 className="mb-1 font-medium">{item}</h3>
              <ul className="space-y-1">
                {["features", "documentation", "dashboard"].map((item) => (
                  <li
                    key={item}
                    className="cursor-pointer text-sm text-zinc-700 capitalize hover:font-medium"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </footer>
  );
};
