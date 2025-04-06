"use client";
import { Calendar, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TimeRangeSelectorProps {
  onTimeRangeChange: (timeRange: string) => void;
  isLoading: boolean;
}

export function TimeRangeSelector({
  onTimeRangeChange,
  isLoading,
}: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center">
      <Select
        defaultValue="30days"
        onValueChange={onTimeRangeChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px]">
          <div className="flex items-center">
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Calendar className="h-4 w-4 mr-2" />
            )}
            <SelectValue placeholder="Select time range" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="30days">Last 30 Days</SelectItem>
          <SelectItem value="3months">Last 3 Months</SelectItem>
          <SelectItem value="1year">Last Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
