"use client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DecorativeSquare } from "@/components/elements/decorative-square";

const DashboardPage = () => {
  return (
    <div className="relative grid h-full flex-1 bg-zinc-900 bg-[url(/static-image.webp)] max-lg:divide-y md:grid-cols-[60%_40%] lg:divide-x [&>section]:relative [&>section]:p-4">
      <DecorativeSquare className="top-0 left-0 border-t border-l" />
      <DecorativeSquare className="bottom-0 left-0 border-b border-l" />
      <DecorativeSquare className="top-0 right-0 border-t border-r" />
      <DecorativeSquare className="right-0 bottom-0 border-r border-b" />

      <section className="">
        <DecorativeSquare className="right-0 -bottom-px border-r border-b md:-right-px md:bottom-0" />
        <DecorativeSquare className="bottom-0 left-0 border-l md:bottom-px md:left-px md:hidden" />
        <DecorativeSquare className="top-0 -right-px border-t border-r max-md:hidden" />

        <div>Dashboard Content</div>
        <Button onClick={() => toast("Event has been created.")}>Toast</Button>
      </section>

      <section className="">
        <DecorativeSquare className="-top-0 -right-0 border-r md:hidden" />
        <DecorativeSquare className="-top-px -left-0 border-t max-md:border-l md:-top-0" />
        <DecorativeSquare className="-bottom-0 -left-0 border-b max-md:hidden" />

        <div>Dashboard Aside</div>
      </section>
    </div>
  );
};

export default DashboardPage;
