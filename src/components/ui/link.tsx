import * as React from "react";
import NextLink from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const linkVariants = cva(
  "flex items-center justify-center rounded-full text-sm font-medium transition-colors h-10 px-5 sm:text-base",
  {
    variants: {
      variant: {
        default: "w-fit px-0 h-fit rounded-none hover:underline",
        primary:
          "bg-foreground text-background border border-solid border-transparent hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-9",
        secondary:
          "border border-solid border-black/[.08] hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]",
        outline:
          "border border-solid border-input hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "",
        sm: "px-3 text-xs sm:px-4 sm:text-sm",
        lg: "px-6 text-base sm:px-8 sm:text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  href: string;
  external?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, size, href, external, children, ...props }, ref) => {
    const isExternal =
      external || href.startsWith("http") || href.startsWith("mailto:");
    const externalProps = isExternal
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    return (
      <NextLink
        href={href}
        className={cn(linkVariants({ variant, size, className }))}
        ref={ref}
        {...externalProps}
        {...props}
      >
        {children}
      </NextLink>
    );
  },
);
Link.displayName = "Link";

export { Link, linkVariants };
