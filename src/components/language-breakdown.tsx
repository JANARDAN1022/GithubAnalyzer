import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { LanguageStat } from "../../types/github";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "./ui/chart";
import { Loader2 } from "lucide-react";

interface LanguageBreakdownProps {
  languageStats: LanguageStat[];
  isLoading: boolean;
}

export function LanguageBreakdown({
  languageStats,
  isLoading,
}: LanguageBreakdownProps) {
  // Colors for the pie chart
  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#6366f1",
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Language Breakdown</CardTitle>
          <CardDescription>
            Programming languages used in repositories
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (languageStats.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Language Breakdown</CardTitle>
          <CardDescription>
            Programming languages used in repositories
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[400px]">
          <p className="text-muted-foreground">No language data available</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for the pie chart
  const data = languageStats.slice(0, 10); // Take top 10 languages
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  // Custom tooltip formatter
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.count / totalCount) * 100).toFixed(1);

      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.count} repos ({percentage}%)
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Language Breakdown</CardTitle>
        <CardDescription>
          Programming languages used in repositories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="name"
              >
                {data.map((_: any, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
