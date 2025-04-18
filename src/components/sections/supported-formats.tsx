"use client";

import Image from "next/image";

export const SupportedFormats = () => {
  const formats = [
    {
      name: "OpenAPI",
      logo: "/logos/openapi.svg",
      description: "OpenAPI Specification"
    },
    {
      name: "Swagger",
      logo: "/logos/swagger.svg",
      description: "Swagger Specification"
    },
    {
      name: "Postman",
      logo: "/logos/postman.svg",
      description: "Postman Collection"
    }
  ];

  return (
    <section className="relative px-4 py-8 md:py-12 overflow-hidden bg-zinc-950/50">
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center gap-6 md:gap-10">
          {/* Simple title */}
          <h2 className="text-xs md:text-sm font-medium tracking-wider uppercase text-zinc-500 text-center px-2">
            Compatible with Industry Standards
          </h2>

          {/* Logos in a row */}
          <div className="grid grid-cols-3 w-full max-w-xs md:max-w-none md:flex md:items-center md:justify-center gap-4 md:gap-16">
            {formats.map((format) => (
              <div
                key={format.name}
                className="flex flex-col items-center gap-2 md:gap-3 group"
              >
                <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={format.logo}
                    alt={`${format.name} logo`}
                    fill
                    className="transition-opacity opacity-70 group-hover:opacity-100"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <span className="text-[10px] md:text-xs font-medium text-zinc-400 group-hover:text-zinc-300 text-center">
                  {format.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 