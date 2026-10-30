import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonStyles = cva(
  "inline-flex min-h-11 items-center justify-center gap-2.5 rounded-md font-semibold transition-all duration-200 active:scale-[0.98] motion-reduce:transform-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-christalle text-white shadow-sm hover:bg-ubuntu hover:shadow-md",
        accent: "bg-ribbon text-white hover:bg-danger",
        secondary: "border border-line-strong bg-transparent text-christalle hover:border-ubuntu hover:bg-chalk/30",
        ghost: "text-ubuntu hover:bg-surface",
        light: "bg-white text-christalle hover:bg-chalk",
        "outline-light": "border border-white/40 text-white hover:bg-white/10",
      },
      size: { sm: "px-4 text-sm", md: "px-6 text-base", lg: "px-8 text-lg min-h-13" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, type = "button", ...props }: Props) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonStyles({ variant, size }), className)} {...(asChild ? {} : { type })} {...props} />;
}
