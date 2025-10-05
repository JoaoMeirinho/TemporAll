import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  // Ano inicial e final para o dropdown (de hoje até 2035)
  const today = new Date();
  const currentYear = today.getFullYear();
  const maxYear = 2035;
  const years = Array.from({ length: maxYear - currentYear + 1 }, (_, i) => currentYear + i);
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
  caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
  day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-black"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white",
  day_today: "bg-accent text-black",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        CaptionLabel: ({ displayMonth }) => {
          // Garante que o mês/ano selecionado nunca fique fora do range permitido
          const minYear = today.getFullYear();
          const maxYear = 2035;
          const minMonth = today.getMonth();
          // O controle de mudança de mês/ano é feito pelo DayPicker via onMonthChange
          return (
            <div className="flex items-center gap-2">
              <select
                className="bg-white border border-gray-300 rounded px-1 py-0.5 text-sm text-black focus:outline-none"
                value={displayMonth.getMonth()}
                onChange={e => {
                  const newMonth = Number(e.target.value);
                  let newDate = new Date(displayMonth);
                  newDate.setMonth(newMonth);
                  // Se o ano for o mínimo, não permitir meses anteriores ao atual
                  if (newDate.getFullYear() === minYear && newMonth < minMonth) {
                    newDate = new Date(minYear, minMonth, 1);
                  }
                  if (props.onMonthChange) props.onMonthChange(newDate);
                }}
              >
                {months.map((month, idx) => {
                  if (displayMonth.getFullYear() === minYear && idx < minMonth) return null;
                  return <option key={month} value={idx}>{month}</option>;
                })}
              </select>
              <select
                className="bg-white border border-gray-300 rounded px-1 py-0.5 text-sm text-black focus:outline-none"
                value={displayMonth.getFullYear()}
                onChange={e => {
                  const newYear = Number(e.target.value);
                  let newDate = new Date(displayMonth);
                  newDate.setFullYear(newYear);
                  if (newYear === minYear && newDate.getMonth() < minMonth) {
                    newDate.setMonth(minMonth);
                  }
                  if (props.onMonthChange) props.onMonthChange(newDate);
                }}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
