"use client";

import { clsx } from "clsx";
import { inputVariants } from "@/lib/styles";
import { forwardRef, useState } from "react";
import { motion } from "framer-motion";

export type Variant = "text" | "textarea";
export type Size = "sm" | "md" | "lg";
export type State = "default" | "error" | "success";

interface BaseProps {
  id?: string;
  label?: string;
  error?: string;
  variant?: Variant;
  size?: Size;
  state?: State;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  placeholder?: string;
  type?: string;
}

// 👇 HTML 기본 size 속성과 충돌 방지용 Omit
type InputPropsText = Omit<
  BaseProps & React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  variant?: "text";
  size?: Size;
};

type InputPropsTextarea = Omit<
  BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> & {
  variant: "textarea";
  size?: Size;
  rows?: number;
};

export type InputProps = InputPropsText | InputPropsTextarea;

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>((props, ref) => {
  const {
    id,
    label,
    error,
    variant = "text",
    size = "md",
    state = "default",
    className,
    disabled = false,
    readOnly = false,
    loading = false,
    placeholder = " ",
    type = "text",
  } = props;

  const isTextarea = variant === "textarea";

  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(
    typeof props.value === "string" ? props.value : ""
  );

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);

    if (isTextarea && "onChange" in props) {
      const textareaProps = props as InputPropsTextarea;
      textareaProps.onChange?.(e as React.ChangeEvent<HTMLTextAreaElement>);
    } else if (!isTextarea && "onChange" in props) {
      const inputProps = props as InputPropsText;
      inputProps.onChange?.(e as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const hasValue = value.length > 0;

  const baseClass = clsx(
    inputVariants({ size, state }),
    "peer w-full placeholder-transparent transition rounded-md border px-3 text-base",
    isTextarea
      ? "pt-4 pb-2 leading-[1.4] min-h-[120px]"
      : "pt-[10px] pb-[9px] leading-[1.25]",
    disabled && "opacity-50 cursor-not-allowed bg-gray-100",
    readOnly && "bg-gray-50",
    loading && "animate-pulse",
    className
  );

  const renderFloatingLabel = () =>
    label && (
      <motion.label
        htmlFor={id}
        className={clsx(
          "absolute left-3 text-gray-400 pointer-events-none transition-all text-sm",
          isTextarea ? "top-1" : "top-[12px]",
          (hasValue || isFocused) &&
            "!-top-1 !translate-y-[-1.2rem] !text-sm !text-blue-500"
        )}
        initial={false}
        animate={{ opacity: 1 }}
      >
        {label}
      </motion.label>
    );

  return (
    <div className="relative w-full">
      {isTextarea ? (
        <>
          <textarea
            id={id}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            placeholder={placeholder}
            className={baseClass}
            disabled={disabled}
            readOnly={readOnly}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={value}
            rows={(props as InputPropsTextarea).rows ?? 4}
          />
          {renderFloatingLabel()}
        </>
      ) : (
        <>
          <input
            id={id}
            type={type}
            ref={ref as React.Ref<HTMLInputElement>}
            placeholder={placeholder}
            className={baseClass}
            disabled={disabled}
            readOnly={readOnly}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={value}
            autoComplete={
              !isTextarea ? (props as InputPropsText).autoComplete : undefined
            }
          />
          {renderFloatingLabel()}
        </>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
