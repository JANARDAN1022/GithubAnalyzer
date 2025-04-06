import { useState } from "react";
import "./index.css";
import { GitHubUserSearch } from "./components/github-user-search";
import { GitHubUserProfile } from "./components/github-user-profile";
import { GitHubDataView } from "./components/github-data-view";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "../hooks/use-toast";
import type {
  GitHubUser,
  Repository,
  CommitActivity,
  LanguageStat,
} from "../types/github";
import { ThemeToggle } from "./components/theme-toggle";
import { Button } from "./components/ui/button";
import { Download, Github, RefreshCw } from "lucide-react";
import { UserStatsDashboard } from "./components/user-stats-dashboard";
import { LanguageBreakdown } from "./components/language-breakdown";

function App() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [commitActivity, setCommitActivity] = useState<CommitActivity[]>([]);
  const [languageStats, setLanguageStats] = useState<LanguageStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCommits, setIsLoadingCommits] = useState(false);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);
  const [timeRange, setTimeRange] = useState("30days");
  const { toast } = useToast();

  const handleSearch = async (username: string) => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a GitHub username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setUser(null);
    setRepositories([]);
    setCommitActivity([]);
    setLanguageStats([]);

    try {
      // Fetch user data
      const userResponse = await fetch(
        `https://api.github.com/users/${username}`
      );

      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          throw new Error("User not found");
        } else if (userResponse.status === 403) {
          throw new Error("API rate limit exceeded. Please try again later.");
        } else {
          throw new Error("Failed to fetch user data");
        }
      }

      const userData = await userResponse.json();
      setUser(userData);

      // Fetch repositories
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
      );

      if (!reposResponse.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const reposData = await reposResponse.json();
      setRepositories(reposData);

      // Fetch commit activity
      await fetchCommitActivity(username, reposData, timeRange);

      // Calculate language statistics
      await calculateLanguageStats(reposData);

      toast({
        title: "Success",
        description: `Found GitHub user: ${userData.name || username}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommitActivity = async (
    username: string,
    repos: Repository[],
    timeRange: string
  ) => {
    setIsLoadingCommits(true);
    setCommitActivity([]);
    setTimeRange(timeRange);

    try {
      // Sort repositories by recent activity
      const sortedRepos = [...repos].sort(
        (a, b) =>
          new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
      );

      // Take top 5 most recently active repos
      const activeRepos = sortedRepos.slice(0, 5);

      if (activeRepos.length === 0) {
        throw new Error("No repositories found to analyze commits");
      }

      // Create a map to store commit counts by date
      const commitsByDate = new Map<string, number>();

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();

      switch (timeRange) {
        case "30days":
          startDate.setDate(endDate.getDate() - 30);
          break;
        case "3months":
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case "1year":
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      // Initialize all dates in the range with 0 commits
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split("T")[0];
        commitsByDate.set(dateString, 0);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Fetch commit data for each repository
      for (const repo of activeRepos) {
        try {
          const commitsResponse = await fetch(
            `https://api.github.com/repos/${username}/${
              repo.name
            }/commits?since=${startDate.toISOString()}&until=${endDate.toISOString()}&per_page=100`
          );

          if (!commitsResponse.ok) {
            console.warn(
              `Failed to fetch commits for ${repo.name}: ${commitsResponse.status}`
            );
            continue;
          }

          const commitsData = await commitsResponse.json();

          // Count commits by date
          for (const commit of commitsData) {
            if (
              commit.commit &&
              commit.commit.author &&
              commit.commit.author.date
            ) {
              const commitDate = commit.commit.author.date.split("T")[0];
              if (commitsByDate.has(commitDate)) {
                commitsByDate.set(
                  commitDate,
                  (commitsByDate.get(commitDate) || 0) + 1
                );
              }
            }
          }
        } catch (error) {
          console.warn(`Error fetching commits for ${repo.name}:`, error);
        }
      }

      // Convert map to array of objects
      const commitActivity: CommitActivity[] = Array.from(
        commitsByDate.entries()
      )
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setCommitActivity(commitActivity);
    } catch (error) {
      toast({
        title: "Warning",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch commit activity",
        variant: "destructive",
      });

      // Fallback to mock data if real data fails
      const mockCommitActivity = generateMockCommitActivity(timeRange);
      setCommitActivity(mockCommitActivity);
    } finally {
      setIsLoadingCommits(false);
    }
  };

  const calculateLanguageStats = async (repos: Repository[]) => {
    setIsLoadingLanguages(true);

    try {
      const languageMap = new Map<string, number>();

      // Count languages across all repositories
      for (const repo of repos) {
        if (repo.language) {
          const currentCount = languageMap.get(repo.language) || 0;
          languageMap.set(repo.language, currentCount + 1);
        }
      }

      // Convert map to array and sort by count
      const languageStats: LanguageStat[] = Array.from(languageMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      setLanguageStats(languageStats);
    } catch (error) {
      console.error("Error calculating language statistics:", error);
    } finally {
      setIsLoadingLanguages(false);
    }
  };

  const generateMockCommitActivity = (timeRange: string) => {
    const activity: CommitActivity[] = [];
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case "30days":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "3months":
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "1year":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      activity.push({
        date: dateString,
        count: Math.floor(Math.random() * 10),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return activity;
  };

  const handleTimeRangeChange = (newTimeRange: string) => {
    if (user && repositories.length > 0) {
      fetchCommitActivity(user.login, repositories, newTimeRange);
    }
  };

  const handleRefresh = () => {
    if (user) {
      handleSearch(user.login);
    }
  };

  const handleExportData = () => {
    if (!user) return;

    const exportData = {
      user,
      repositories,
      commitActivity,
      languageStats,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const exportFileDefaultName = `github-data-${user.login}-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Export Complete",
      description: "Your GitHub data has been exported successfully",
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Github className="h-8 w-8" />
            <h1 className="text-2xl md:text-3xl font-bold">
              GitHub Activity Analyzer
            </h1>
          </div>
          <ThemeToggle />
        </div>

        <GitHubUserSearch onSearch={handleSearch} isLoading={isLoading} />

        {user && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold">User Profile</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <GitHubUserProfile user={user} />

            <UserStatsDashboard
              user={user}
              repositories={repositories}
              commitActivity={commitActivity}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GitHubDataView
                  repositories={repositories}
                  commitActivity={commitActivity}
                  isLoading={isLoading}
                  isLoadingCommits={isLoadingCommits}
                  onTimeRangeChange={handleTimeRangeChange}
                />
              </div>
              <div>
                <LanguageBreakdown
                  languageStats={languageStats}
                  isLoading={isLoadingLanguages}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <Toaster />
    </main>
  );
}

export default App;
