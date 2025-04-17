"use client";

import { GlareCard } from "@/components/ui/glare-card";

// Skeleton components for API doc visualizations
const ApiEndpointSkeleton = () => (
  <div className="flex flex-col w-full h-full p-6 space-y-4">
    <div className="flex items-center space-x-2">
      <div className="px-2 py-1 text-xs font-bold text-green-400 rounded-md bg-green-900/30">GET</div>
      <div className="font-mono text-sm text-slate-300">/api/v1/users</div>
    </div>
    <div className="space-y-2">
      <div className="w-3/4 h-2 rounded-full bg-slate-700"></div>
      <div className="w-1/2 h-2 rounded-full bg-slate-700"></div>
    </div>
    <div className="flex-1 p-3 rounded-md">
      <div className="space-y-1.5">
        <div className="h-1.5 w-full bg-slate-700 rounded-full"></div>
        <div className="h-1.5 w-4/5 bg-slate-700 rounded-full"></div>
        <div className="h-1.5 w-2/3 bg-slate-700 rounded-full"></div>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <div className="px-2 py-1 text-xs font-bold text-yellow-400 rounded-md bg-yellow-900/30">UPDATE</div>
      <div className="font-mono text-sm text-slate-300">/api/v1/users/{"{"}"id{"}"}</div>
    </div>
    <div className="space-y-2">
      <div className="w-2/3 h-2 rounded-full bg-slate-700"></div>
      <div className="w-1/2 h-2 rounded-full bg-slate-700"></div>
    </div>
    <div className="flex-1 p-3 rounded-md">
      <div className="space-y-1.5">
        <div className="h-1.5 w-full bg-slate-700 rounded-full"></div>
        <div className="h-1.5 w-3/4 bg-slate-700 rounded-full"></div>
      </div>
    </div>
  </div>
);

const CodeExampleSkeleton = () => (
  <div className="flex flex-col w-full h-full p-6">
    <div className="flex items-center mb-3 space-x-2">
      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
    </div>
    <div className="flex-1 p-4 font-mono text-xs rounded-md text-slate-300">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-purple-400">const</span>
          <span className="text-blue-400">response</span>
          <span className="text-slate-400">=</span>
          <span className="text-green-400">await</span>
          <span className="text-yellow-400">fetch</span>
          <span className="text-slate-400">(</span>
          <span className="text-orange-400">'/api/v1/users'</span>
          <span className="text-slate-400">);</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-purple-400">const</span>
          <span className="text-blue-400">users</span>
          <span className="text-slate-400">=</span>
          <span className="text-green-400">await</span>
          <span className="text-blue-400">response</span>
          <span className="text-yellow-400">.json</span>
          <span className="text-slate-400">();</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-purple-400">const</span>
          <span className="text-blue-400">updatedUser</span>
          <span className="text-slate-400">=</span>
          <span className="text-green-400">await</span>
          <span className="text-yellow-400">fetch</span>
          <span className="text-slate-400">(</span>
          <span className="text-orange-400">'/api/v1/users/123'</span>
          <span className="text-slate-400">,</span>
        </div>
        <div className="flex items-center pl-4 space-x-2">
          <span className="text-slate-400">{"{"}</span>
          <span className="text-blue-400">method</span>
          <span className="text-slate-400">:</span>
          <span className="text-orange-400">'PUT'</span>
          <span className="text-slate-400">{"}"}</span>
          <span className="text-slate-400">);</span>
        </div>
      </div>
    </div>
  </div>
);

const ResponseSchemaSkeleton = () => (
  <div className="flex flex-col items-center justify-center w-full h-full p-6">
    <div className="w-full p-4 font-mono text-xs rounded-md">
      <div className="mb-1 text-green-400">{"{"}</div>
      <div className="pl-4 text-blue-400">
        <span className="text-yellow-400">"users"</span>: [
      </div>
      <div className="pl-8 text-green-400">{"{"}</div>
      <div className="pl-12">
        <div><span className="text-yellow-400">"id"</span>: <span className="text-purple-400">1</span>,</div>
        <div><span className="text-yellow-400">"name"</span>: <span className="text-orange-400">"John Doe"</span>,</div>
        <div><span className="text-yellow-400">"email"</span>: <span className="text-orange-400">"john@example.com"</span></div>
      </div>
      <div className="pl-8 text-green-400">{"}"}</div>
      <div className="pl-4 text-blue-400">]</div>
      <div className="text-green-400">{"}"}</div>
    </div>
  </div>
);

const CustomDomainSkeleton = () => (
  <div className="flex flex-col w-full h-full p-6">
    <div className="flex items-center px-3 py-2 mb-4 font-mono text-xs rounded-md bg-slate-800">
      <span className="mr-1 text-green-400">https://</span>
      <span className="text-white">api-docs</span>
      <span className="text-slate-400">.yourdomain.com</span>
    </div>
    <div className="flex flex-col items-center justify-center flex-1 space-y-3">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <div className="w-24 h-3 rounded-full bg-slate-700"></div>
      <div className="h-2 rounded-full w-36 bg-slate-700"></div>
    </div>
  </div>
);

export const BenefitsSection = () => {
  return (
    <section className="px-4 py-20 bg-zinc-950">
      <div className="mx-auto max-w-[1400px]">
        {/* Section header */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            <span className="text-transparent bg-gradient-to-r from-green-400 to-green-600 bg-clip-text">Powerful features</span> for developers
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-zinc-400">
            Create documentation that is smarter, more accessible, and continuously improving with our intelligent features.
          </p>
        </div>
        
        {/* Benefits grid with glare cards - improved layout */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex justify-center w-full">
            <GlareCard className="flex flex-col items-stretch justify-start bg-zinc-950/90 border-zinc-900 w-full max-w-[280px] sm:max-w-full [aspect-ratio:15/16]">
              <div className="flex flex-col items-start justify-between h-full">
                <ApiEndpointSkeleton />
                <div className="p-6 pt-0">
                </div>
              </div>
            </GlareCard>
          </div>
          
          <div className="flex justify-center w-full">
            <GlareCard className="flex flex-col items-stretch justify-start bg-zinc-950/90 border-zinc-900 w-full max-w-[280px] sm:max-w-full [aspect-ratio:15/16]">
              <div className="flex flex-col items-start justify-between h-full">
                <CodeExampleSkeleton />
                <div className="p-6 pt-0">
                </div>
              </div>
            </GlareCard>
          </div>
          
          <div className="flex justify-center w-full">
            <GlareCard className="flex flex-col items-stretch justify-start bg-zinc-950/90 border-zinc-900 w-full max-w-[280px] sm:max-w-full [aspect-ratio:15/16]">
              <div className="flex flex-col items-start justify-between h-full">
                <ResponseSchemaSkeleton />
                <div className="p-6 pt-0">
                </div>
              </div>
            </GlareCard>
          </div>
          
          <div className="flex justify-center w-full">
            <GlareCard className="flex flex-col items-stretch justify-start bg-zinc-950/90 border-zinc-900 w-full max-w-[280px] sm:max-w-full [aspect-ratio:15/16]">
              <div className="flex flex-col items-start justify-between h-full">
                <CustomDomainSkeleton />
                <div className="p-6 pt-0">
                </div>
              </div>
            </GlareCard>
          </div>
        </div>
      </div>
    </section>
  );
};