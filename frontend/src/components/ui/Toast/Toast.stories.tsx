"use client";
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, useToast } from "./ToastProvider";
import { Button } from "../Button/Button";

const meta: Meta<typeof Button> = {
  title: "Components/Toast",
  component: Button,
  tags: ["autodocs"],
  decorators: [
    (StoryFn) => (
      <ToastProvider>
        <StoryFn />
      </ToastProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Button>;

const Example = () => {
  const { showToast } = useToast();
  return (
    <Button
      label="토스트 보기"
      onClick={() => showToast("✅ 할 일이 등록되었습니다!")}
    />
  );
};

export const Default: Story = {
  name: "기본 토스트 예제",
  render: () => <Example />,
};
