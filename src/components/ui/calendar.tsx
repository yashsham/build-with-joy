"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-black border border-white/10 rounded-2xl", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-between pt-1 relative items-center px-2",
        caption_label: "text-sm font-semibold text-white font-heading",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 text-white/60 hover:text-white border-white/10 hover:bg-white/5 opacity-80 hover:opacity-100"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full justify-between mt-2",
        head_cell: "text-white/40 rounded-md w-9 font-normal text-[10px] uppercase tracking-wider text-center luxe-subtitle",
        row: "flex w-full justify-between mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-white/5 [&:has([aria-selected])]:bg-white/5 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-white/80 hover:bg-white/5 hover:text-white aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gold-gradient text-dark font-bold hover:bg-gold-gradient hover:text-dark focus:bg-gold-gradient focus:text-dark shadow-[var(--shadow-gold-sm)] rounded-xl",
        day_today: "border border-gold-600/30 text-gold-600 font-semibold rounded-xl",
        day_outside:
          "day-outside text-white/20 aria-selected:bg-white/5 aria-selected:text-white/40",
        day_disabled: "text-white/10 opacity-30 pointer-events-none",
        day_range_middle:
          "aria-selected:bg-white/5 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 text-gold-600" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-gold-600" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
