"use client";

import { useRef } from "react";
import { Card } from "./ui/card";
import type { CommitActivity } from "../../types/github";
import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "./ui/chart";
import { Loader2 } from "lucide-react";

interface CommitActivityChartProps {
  commitActivity: CommitActivity[];
  isLoading: boolean;
}

export function CommitActivityChart({
  commitActivity,
  isLoading,
}: CommitActivityChartProps) {
  const { resolvedTheme } = useTheme();
  const chartRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (commitActivity.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[400px] text-center">
        <p className="text-muted-foreground mb-2">
          No commit activity data available
        </p>
        <p className="text-sm text-muted-foreground">
          This could be because the user has no recent commits or the
          repositories are private.
        </p>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Get theme colors
  const isDark = resolvedTheme === "dark";
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const barColor = isDark ? "#3b82f6" : "#2563eb";

  // Calculate total commits
  const totalCommits = commitActivity.reduce((sum, day) => sum + day.count, 0);
  const activeCommitDays = commitActivity.filter((day) => day.count > 0).length;

  // Calculate interval for x-axis ticks based on data length
  const calculateTickInterval = () => {
    if (commitActivity.length <= 30) return 5;
    if (commitActivity.length <= 90) return 15;
    return 30;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{totalCommits}</div>
          <div className="text-sm text-muted-foreground">Total Commits</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{activeCommitDays}</div>
          <div className="text-sm text-muted-foreground">Active Days</div>
        </Card>
      </div>

      <div ref={chartRef} className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={commitActivity}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 30,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke={textColor}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              interval={calculateTickInterval()}
            />
            <YAxis stroke={textColor} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                color: textColor,
                border: `1px solid ${gridColor}`,
                borderRadius: "6px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [`${value} commits`, "Commits"]}
              labelFormatter={(label) => `Date: ${formatDate(label)}`}
            />
            <Bar
              dataKey="count"
              fill={barColor}
              radius={[4, 4, 0, 0]}
              name="Commits"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
