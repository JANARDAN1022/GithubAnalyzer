"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { RepositoriesList } from "./repositories-list";
import { CommitActivityChart } from "./commit-activity-chart";
import { ViewSelector } from "./view-selector";
import { TimeRangeSelector } from "./time-range-selector";
import type { Repository, CommitActivity } from "../../types/github";
import { Loader2 } from "lucide-react";

interface GitHubDataViewProps {
  repositories: Repository[];
  commitActivity: CommitActivity[];
  isLoading: boolean;
  isLoadingCommits: boolean;
  onTimeRangeChange: (timeRange: string) => void;
}

type CommitViewType = "tabs" | "chart";

export function GitHubDataView({
  repositories,
  commitActivity,
  isLoading,
  isLoadingCommits,
  onTimeRangeChange,
}: GitHubDataViewProps) {
  const [commitView, setCommitView] = useState<CommitViewType>("tabs");

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold">Repository & Commit Activity</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <TimeRangeSelector
            onTimeRangeChange={onTimeRangeChange}
            isLoading={isLoadingCommits}
          />
          <ViewSelector
            currentView={commitView}
            onViewChange={(view) => setCommitView(view as CommitViewType)}
          />
        </div>
      </div>

      {commitView === "tabs" ? (
        <Tabs defaultValue="repositories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="repositories">
              Repositories ({repositories.length})
            </TabsTrigger>
            <TabsTrigger value="commits">Commit Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="repositories">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Public Repositories</CardTitle>
                <CardDescription>
                  List of public repositories for this user
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RepositoriesList repositories={repositories} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="commits">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Commit Activity</CardTitle>
                <CardDescription>
                  Daily commit activity over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommitActivityChart
                  commitActivity={commitActivity}
                  isLoading={isLoadingCommits}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Public Repositories</CardTitle>
              <CardDescription>
                List of public repositories for this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RepositoriesList repositories={repositories} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Commit Activity</CardTitle>
              <CardDescription>Daily commit activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <CommitActivityChart
                commitActivity={commitActivity}
                isLoading={isLoadingCommits}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
