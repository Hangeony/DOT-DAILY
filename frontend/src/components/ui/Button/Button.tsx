"use client";

import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import { buttonVariants } from "@/lib/styles";
import type { VariantProps } from "class-variance-authority";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
type ButtonSize = VariantProps<typeof buttonVariants>["size"];
type ButtonRounded = VariantProps<typeof buttonVariants>["rounded"];
type ButtonFullWidth = VariantProps<typeof buttonVariants>["fullWidth"];

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  fullWidth?: ButtonFullWidth;
  className?: string;
  children?: React.ReactNode;
}

export const Button = ({
  label,
  variant = "primary",
  size = "md",
  rounded,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        buttonVariants({ variant, size, rounded, fullWidth }),
        className
      )}
      {...props}
    >
      {children ?? label}
    </button>
  );
};
