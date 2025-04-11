import { DecorativeSquare } from "@/components/elements/decorative-square";

const EditorPage = () => {
  return (
    <div className="relative grid h-full bg-[url(/static-image.webp)] max-lg:divide-y md:grid-cols-[60%_40%] lg:divide-x [&>section]:relative [&>section]:p-4">
      <section className="">
        <DecorativeSquare className="right-0 -bottom-px border-r border-b md:-right-px md:bottom-0" />
        <DecorativeSquare className="bottom-0 left-0 border-l md:bottom-px md:left-px md:hidden" />
        <DecorativeSquare className="top-0 -right-px border-t border-r max-md:hidden" />

        <div>Edit MDX Content</div>
      </section>

      <section className="">
        <DecorativeSquare className="-top-0 -right-0 border-r md:hidden" />
        <DecorativeSquare className="-top-px -left-0 border-t max-md:border-l md:-top-0" />
        <DecorativeSquare className="-bottom-0 -left-0 border-b max-md:hidden" />

        <div>MDX Preview</div>
      </section>
    </div>
  );
};

export default EditorPage;
