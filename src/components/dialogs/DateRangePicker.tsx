import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  value: string;
  onChange: (value: string, startDate: Date, endDate: Date) => void;
}

const presets = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "14d", label: "Last 14 days", days: 14 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
  { id: "ytd", label: "Year to date", days: -1 },
];

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    const endDate = new Date();
    let startDate: Date;

    if (preset.days === -1) {
      // Year to date
      startDate = new Date(endDate.getFullYear(), 0, 1);
    } else {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - preset.days);
    }

    onChange(preset.label, startDate, endDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {value}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelect(preset.id)}
              className={cn(
                "w-full rounded-md px-3 py-2 text-sm text-left transition-colors",
                value === preset.label
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
