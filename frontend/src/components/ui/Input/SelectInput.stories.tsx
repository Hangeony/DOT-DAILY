import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SelectInput } from "./SelectInput";

const meta: Meta<typeof SelectInput> = {
  title: "UI/SelectInput",
  component: SelectInput,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    state: {
      control: "radio",
      options: ["default", "error", "success"],
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof SelectInput>;

const sampleOptions = [
  { label: "선택 1", value: "1" },
  { label: "선택 2", value: "2" },
  { label: "선택 3", value: "3" },
];

const SelectInputWrapper = (args: React.ComponentProps<typeof SelectInput>) => {
  const [value, setValue] = useState(args.value ?? "1");
  return (
    <SelectInput
      {...args}
      value={value}
      onChange={setValue}
      options={sampleOptions}
    />
  );
};

export const Default: Story = {
  name: "기본",
  render: (args) => <SelectInputWrapper {...args} />,
};

export const Error: Story = {
  name: "에러 상태",
  render: (args) => <SelectInputWrapper {...args} state="error" />,
};

export const Disabled: Story = {
  name: "비활성화 상태",
  render: (args) => <SelectInputWrapper {...args} disabled />,
};

export const Loading: Story = {
  name: "로딩 상태",
  render: (args) => <SelectInputWrapper {...args} loading />,
};

export const Sizes: Story = {
  name: "사이즈별 예시",
  render: (args) => (
    <div className="space-y-4">
      <SelectInputWrapper {...args} label="Small" size="sm" />
      <SelectInputWrapper {...args} label="Medium" size="md" />
      <SelectInputWrapper {...args} label="Large" size="lg" />
    </div>
  ),
};
