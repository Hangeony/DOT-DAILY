import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  args: {
    size: "md",
    state: "default",
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const BasicTextInput: Story = {
  args: {
    variant: "text",
    label: "텍스트 입력",
    id: "text-id",
    placeholder: "텍스트 입력",
  },
};

export const BasicTextareaInput: Story = {
  args: {
    variant: "textarea",
    label: "내용 입력",
    id: "textarea-id",
    placeholder: "내용 입력",
  },
};

export const TextInputWithError: Story = {
  args: {
    variant: "text",
    label: "입력 오류",
    id: "error-id",
    error: "에러 메시지 예시",
    placeholder: " ",
    state: "error",
  },
};
