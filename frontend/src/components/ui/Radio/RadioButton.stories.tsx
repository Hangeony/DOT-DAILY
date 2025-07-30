import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import RadioButton from "./RadioButton";

const meta: Meta<typeof RadioButton> = {
  title: "Components/Radio/RadioButton",
  component: RadioButton,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof RadioButton>;

const Example = () => {
  const [priority, setPriority] = useState<"must" | "should" | "remind">(
    "must"
  );
  return (
    <div className="flex flex-col gap-4">
      <RadioButton
        name="priority"
        value="must"
        variant="must"
        checked={priority === "must"}
        onChange={() => setPriority("must")}
        label={
          <span>
            <span
              className="inline-flex items-center justify-center w-5 h-5 mr-1 text-center rounded-full bg-priority-must text-white text-xs font-bold"
              style={{ lineHeight: "1.3rem" }}
            >
              1
            </span>{" "}
            오늘 무조건
          </span>
        }
      />
      <RadioButton
        name="priority"
        value="should"
        variant="should"
        checked={priority === "should"}
        onChange={() => setPriority("should")}
        label={
          <span>
            <span
              className="inline-flex items-center justify-center w-5 h-5 mr-1 text-center rounded-full bg-priority-should text-white text-xs font-bold"
              style={{ lineHeight: "1.3rem" }}
            >
              2
            </span>{" "}
            오늘이면 굿
          </span>
        }
      />
      <RadioButton
        name="priority"
        value="remind"
        variant="remind"
        checked={priority === "remind"}
        onChange={() => setPriority("remind")}
        label={
          <span>
            <span
              className="inline-flex items-center justify-center w-5 h-5 mr-1 text-center rounded-full bg-priority-remind text-white text-xs font-bold"
              style={{ lineHeight: "1.3rem" }}
            >
              3
            </span>
            잊지말자
          </span>
        }
      />
    </div>
  );
};

export const PriorityRadio: Story = {
  name: "우선순위 라디오",
  render: () => <Example />,
};
