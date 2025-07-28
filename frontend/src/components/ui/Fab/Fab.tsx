"use client";

import { Button, type ButtonProps } from "../Button/Button";
import { clsx } from "clsx";

// ButtonProps에서 Fab과 관련 없는 props를 Omit으로 제외하여
// Fab 컴포넌트의 props를 더 명확하게 만듭니다.
type FabProps = Omit<
  ButtonProps,
  "variant" | "size" | "rounded" | "fullWidth" | "label"
>;

export default function Fab({ className, children, ...props }: FabProps) {
  return (
    // 내부적으로 Button 컴포넌트를 사용하되, Fab에 맞는 스타일을 덮어씁니다.
    <Button
      variant="primary"
      rounded="full"
      // clsx를 사용해 기존 Button 스타일에 Fab 전용 스타일(크기, 그림자, 패딩)을 추가/재정의합니다.
      className={clsx(
        "w-12 h-12 sm:w-14 sm:h-14 p-0 shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow duration-200",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
