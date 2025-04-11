import { cn } from "@/lib/utils";

interface DecorativeSquareProps {
  className?: string;
}

export const DecorativeSquare: React.FC<DecorativeSquareProps> = ({
  className,
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-40 aspect-square w-4 border-0 border-emerald-500",
        className,
      )}
    />
  );
};
