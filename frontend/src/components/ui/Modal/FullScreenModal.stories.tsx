"use client";
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  FullScreenModalProvider,
  useFullScreenModal,
} from "./providers/FullScreenModalProvider";
import { Button } from "../Button/Button";
import { ToastProvider } from "../Toast/ToastProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const meta: Meta = {
  title: "Components/FullScreenModal",
  component: () => null,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (StoryFn) => {
      const [queryClient] = useState(() => new QueryClient());
      return (
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <FullScreenModalProvider>
              <StoryFn />
            </FullScreenModalProvider>
          </ToastProvider>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj;

const TaskFormExample = () => {
  const { openModal } = useFullScreenModal();
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">할 일 추가 모달</h2>
      <Button
        label="할 일 추가 모달 열기"
        onClick={() =>
          openModal("taskForm", {
            defaultDate: "2025-06-20",
          })
        }
      />
    </div>
  );
};

const RetrospectFormExample = () => {
  const { openModal } = useFullScreenModal();
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">회고 작성 모달</h2>
      <Button
        label="회고 작성 모달 열기"
        onClick={() => openModal("retrospectForm")}
      />
    </div>
  );
};

const DateNavigationExample = () => {
  const { openModal } = useFullScreenModal();
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">날짜 선택 모달</h2>
      <Button
        label="날짜 선택 모달 열기"
        onClick={() => openModal("dateNavigationForm")}
      />
    </div>
  );
};

const AllModalsExample = () => {
  const { openModal } = useFullScreenModal();
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">전체화면 모달 예시</h2>
      <div className="flex flex-col gap-2">
        <Button
          label="할 일 추가 모달"
          onClick={() =>
            openModal("taskForm", {
              defaultDate: "2025-06-20",
            })
          }
        />
        <Button
          label="회고 작성 모달"
          onClick={() => openModal("retrospectForm")}
        />
        <Button
          label="날짜 선택 모달"
          onClick={() => openModal("dateNavigationForm")}
        />
      </div>
    </div>
  );
};

export const TaskForm: Story = {
  render: () => <TaskFormExample />,
};

export const RetrospectForm: Story = {
  render: () => <RetrospectFormExample />,
};

export const DateNavigation: Story = {
  render: () => <DateNavigationExample />,
};

export const AllModals: Story = {
  render: () => <AllModalsExample />,
};
