"use client";

import { forwardRef } from "react";
import { DateInput } from "@/components/ui/date-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TitleFieldProps {
  id: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
}

export const TitleField = forwardRef<HTMLInputElement, TitleFieldProps>(
  function TitleField(
    { id, value, onChange, onKeyDown, disabled, error, autoFocus, ...props },
    ref
  ) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>제목</Label>
        <Input
          ref={ref}
          id={id}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="작업 제목 입력"
          maxLength={100}
          disabled={disabled}
          autoFocus={autoFocus}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

interface DescriptionFieldProps {
  id: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  error?: string;
  rows?: number;
}

export const DescriptionField = forwardRef<
  HTMLTextAreaElement,
  DescriptionFieldProps
>(function DescriptionField(
  { id, value, onChange, disabled, error, rows = 3, ...props },
  ref
) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>설명 (선택)</Label>
      <Textarea
        ref={ref}
        id={id}
        value={value}
        onChange={onChange}
        placeholder="작업 설명"
        maxLength={1000}
        rows={rows}
        disabled={disabled}
        {...props}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
});

interface DueDateFieldProps {
  id: string;
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  labelExtra?: React.ReactNode;
}

export function DueDateField({
  id,
  value,
  onChange,
  disabled,
  labelExtra,
}: DueDateFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id}>마감일 (선택)</Label>
        {labelExtra}
      </div>
      <DateInput
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
