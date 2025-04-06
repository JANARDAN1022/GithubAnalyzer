"use client";

import { useState } from "react";
import type { Repository } from "../../types/github";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Star,
  GitFork,
  Eye,
  Search,
  ExternalLink,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface RepositoriesListProps {
  repositories: Repository[];
}

type SortOption = "stars" | "updated" | "name" | "created";

export function RepositoriesList({ repositories }: RepositoriesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated");

  const filteredRepos = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description &&
        repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedRepos = [...filteredRepos].sort((a, b) => {
    switch (sortBy) {
      case "stars":
        return b.stargazers_count - a.stargazers_count;
      case "updated":
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      case "name":
        return a.name.localeCompare(b.name);
      case "created":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (repositories.length === 0) {
    return <div className="text-center py-8">No repositories found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Recently Updated</SelectItem>
            <SelectItem value="stars">Most Stars</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="created">Recently Created</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {sortedRepos.length > 0 ? (
            sortedRepos.map((repo) => (
              <Card
                key={repo.id}
                className="overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg break-words">
                        {repo.name}
                      </CardTitle>
                      {repo.description && (
                        <CardDescription className="line-clamp-2 mt-1">
                          {repo.description}
                        </CardDescription>
                      )}
                    </div>
                    {repo.fork && (
                      <Badge variant="outline" className="ml-2 shrink-0">
                        Fork
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2">
                    {repo.language && (
                      <Badge variant="secondary">{repo.language}</Badge>
                    )}
                    {repo.topics &&
                      repo.topics.slice(0, 3).map((topic) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-0">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {repo.stargazers_count}
                    </div>
                    <div className="flex items-center">
                      <GitFork className="h-4 w-4 mr-1" />
                      {repo.forks_count}
                    </div>
                    {repo.watchers_count > 0 && (
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {repo.watchers_count}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(repo.updated_at)}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      View <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              No matching repositories found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
