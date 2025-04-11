"use client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DecorativeSquare } from "@/components/elements/decorative-square";

const DashboardPage = () => {
  return (
    <div className="relative m-4 grid flex-1 bg-zinc-900 bg-[url(/static-image.webp)] max-lg:divide-y lg:grid-cols-[60%_40%] lg:divide-x [&>section]:relative [&>section]:p-4">
      <DecorativeSquare className="-top-px -left-px border-t border-l" />
      <DecorativeSquare className="-bottom-px -left-px border-b border-l" />
      <DecorativeSquare className="-right-px -bottom-px border-r border-b" />
      <DecorativeSquare className="-top-px -right-px border-t border-r" />

      <section className="size-full">
        <DecorativeSquare className="-top-px -right-px border-t border-r max-lg:hidden" />
        <DecorativeSquare className="-right-px -bottom-px border-r border-b" />
        <DecorativeSquare className="-bottom-px -left-px border-l lg:hidden" />
        <div>Dashboard Content</div>
        <Button onClick={() => toast("Event has been created.")}>Toast</Button>
      </section>

      <section className="">
        <DecorativeSquare className="-top-px -left-px border-t max-lg:border-l" />
        <DecorativeSquare className="-bottom-px -left-px border-b max-lg:hidden" />
        <DecorativeSquare className="-top-px -right-px border-r lg:hidden" />

        <div>Dashboard Aside</div>
      </section>
    </div>
  );
};

export default DashboardPage;
