"use client";

import React from "react";
import { clsx } from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
  text,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={clsx("flex flex-col items-center justify-center", className)}
    >
      <div
        className={clsx(
          "animate-spin rounded-full border-2 border-gray-300 border-t-blue-500",
          sizeClasses[size]
        )}
      />
      {text && <p className="mt-2 text-sm text-gray-500 text-center">{text}</p>}
    </div>
  );
};
