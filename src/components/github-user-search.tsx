"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Search, Loader2, History } from "lucide-react";

interface GitHubUserSearchProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

export function GitHubUserSearch({
  onSearch,
  isLoading,
}: GitHubUserSearchProps) {
  const [username, setUsername] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    // Load search history from localStorage if available
    const savedHistory = localStorage.getItem("githubSearchHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    // Add to search history if not already present
    if (!searchHistory.includes(username)) {
      const newHistory = [username, ...searchHistory].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem("githubSearchHistory", JSON.stringify(newHistory));
    }

    onSearch(username);
    setShowHistory(false);
  };

  const handleHistoryClick = (historyItem: string) => {
    setUsername(historyItem);
    onSearch(historyItem);
    setShowHistory(false);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              className="pl-10"
              disabled={isLoading}
            />
            {showHistory && searchHistory.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
                <div className="p-2 text-xs text-muted-foreground flex items-center">
                  <History className="h-3 w-3 mr-1" />
                  Recent searches
                </div>
                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                    onClick={() => handleHistoryClick(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button type="submit" disabled={isLoading} className="shrink-0">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
