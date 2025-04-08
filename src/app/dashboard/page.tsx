import { DecorativeSquare } from "@/components/elements/decorative-square";

const DashboardPage = () => {
  return (
    <div className="relative m-4 grid flex-1 divide-y border bg-[url(/static-image.webp)] [&>section]:p-4">
      <DecorativeSquare className="-top-px -left-px border-t border-l" />
      <DecorativeSquare className="-bottom-px -left-px border-b border-l" />
      <DecorativeSquare className="-right-px -bottom-px border-r border-b" />
      <DecorativeSquare className="-top-px -right-px border-t border-r" />

      <section>Dashboard Content</section>
      <section>Dashboard Aside</section>
    </div>
  );
};

export default DashboardPage;
