"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

type DatePickerProps = {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
};

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    new Date("2025-06-01")
  );
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value ?? undefined
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [inputValue, setInputValue] = React.useState(
    formatDate(value ?? internalDate)
  );

  const handleDateChange = (newDate: Date | undefined) => {
    setInternalDate(newDate);
    setInputValue(formatDate(newDate));
    onChange?.(newDate ?? null);
  };

  return (
    <div className="relative flex gap-2">
      <Input
        id="date"
        value={inputValue}
        placeholder="June 01, 2025"
        className="bg-background pr-10"
        onChange={(e) => {
          const newDate = new Date(e.target.value);
          setInputValue(e.target.value);
          if (isValidDate(newDate)) {
            handleDateChange(newDate);
            setMonth(newDate);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              handleDateChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
