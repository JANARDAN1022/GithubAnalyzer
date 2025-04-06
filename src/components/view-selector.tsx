"use client";

import { Button } from "./ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  return (
    <div className="flex items-center space-x-2 bg-muted rounded-md p-1">
      <Button
        variant={currentView === "tabs" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("tabs")}
        className="h-8"
      >
        <LayoutList className="h-4 w-4 mr-2" />
        Tabs View
      </Button>
      <Button
        variant={currentView === "chart" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("chart")}
        className="h-8"
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Chart View
      </Button>
    </div>
  );
}
