import { cva } from "class-variance-authority";

export const selectInputVariants = cva(
  "relative w-full rounded-md border bg-white px-3 py-2 text-left cursor-pointer transition focus:ring-1",
  {
    variants: {
      size: {
        sm: "h-8 text-sm",
        md: "h-10 text-base",
        lg: "h-12 text-lg",
      },
      state: {
        default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
        error: "border-red-500 focus:border-red-500 focus:ring-red-500",
        success: "border-green-500 focus:border-green-500 focus:ring-green-500",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
      disabled: false,
    },
  }
);
