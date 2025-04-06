import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type {
  GitHubUser,
  Repository,
  CommitActivity,
} from "../../types/github";
import { FileCode, GitFork, Star, Users } from "lucide-react";

interface UserStatsDashboardProps {
  user: GitHubUser;
  repositories: Repository[];
  commitActivity: CommitActivity[];
}

export function UserStatsDashboard({
  user,
  repositories,
}: UserStatsDashboardProps) {
  // Calculate statistics
  const totalStars = repositories.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );
  const totalForks = repositories.reduce(
    (sum, repo) => sum + repo.forks_count,
    0
  );
  // const totalCommits = commitActivity.reduce((sum, day) => sum + day.count, 0);

  // // Find most popular repository
  // const mostPopularRepo =
  //   repositories.length > 0
  //     ? repositories.reduce((prev, current) =>
  //         prev.stargazers_count > current.stargazers_count ? prev : current
  //       )
  //     : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-2" />
            <div className="text-2xl font-bold">{totalStars}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all repositories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Forks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <GitFork className="h-4 w-4 text-primary mr-2" />
            <div className="text-2xl font-bold">{totalForks}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all repositories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Repositories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <FileCode className="h-4 w-4 text-green-500 mr-2" />
            <div className="text-2xl font-bold">{repositories.length}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Public repositories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Followers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-purple-500 mr-2" />
            <div className="text-2xl font-bold">{user.followers}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {user.following} following
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
