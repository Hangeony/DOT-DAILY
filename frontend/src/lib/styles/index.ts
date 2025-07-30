// Styles Variants Barrel Export
export { buttonVariants } from "./buttonVariants";
export {
  inputVariants,
  type InputVariantProps,
  type InputSize,
} from "./inputVariants";
export { checkboxVariants } from "./checkboxVariants";
export { radioVariants } from "./radioVariants";
export { modalVariants } from "./modalVariants";
export { selectInputVariants } from "./selectInputVariants";

// Design Tokens (추후 추가 가능)
export const designTokens = {
  colors: {
    brand: {
      primary: "brand-primary",
      secondary: "brand-secondary",
    },
    priority: {
      must: "priority-must",
      should: "priority-should",
      remind: "priority-remind",
    },
    status: {
      success: "status-success",
      error: "status-error",
      warning: "status-warning",
    },
  },
  spacing: {
    xs: "1",
    sm: "2",
    md: "4",
    lg: "6",
    xl: "8",
  },
  borderRadius: {
    none: "0",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    full: "9999px",
  },
} as const;
