"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerButtonProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  /** 선택된 날짜 앞에 표시할 라벨 */
  label?: string;
}

export function DatePickerButton({
  value,
  onChange,
  disabled = false,
  placeholder = "날짜 선택",
  label,
}: DatePickerButtonProps) {
  const [open, setOpen] = useState(false);

  const displayText = value
    ? `${label ? `${label}: ` : ""}${format(value, "yyyy년 M월 d일", { locale: ko })}`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="w-full justify-start text-xs text-muted-foreground hover:text-foreground h-8"
        >
          <Calendar className="size-3" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          locale={ko}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
