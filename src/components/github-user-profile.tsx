import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { GitHubUser } from "../../types/github";
import { Users, MapPin, Link2, Calendar, Mail, Building } from "lucide-react";
import { Button } from "./ui/button";

interface GitHubUserProfileProps {
  user: GitHubUser;
}

export function GitHubUserProfile({ user }: GitHubUserProfileProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar className="h-24 w-24 border-2 border-border">
            <AvatarImage src={user.avatar_url} alt={user.login} />
            <AvatarFallback>
              {user.login.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-4 text-center md:text-left flex-1">
            <div>
              <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
              <p className="text-muted-foreground">@{user.login}</p>
            </div>

            {user.bio && <p className="max-w-prose">{user.bio}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {user.followers !== undefined && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>{user.followers}</strong> followers ·{" "}
                    <strong>{user.following}</strong> following
                  </span>
                </div>
              )}

              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.location}</span>
                </div>
              )}

              {user.company && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{user.company}</span>
                </div>
              )}

              {user.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${user.email}`}
                    className="text-primary hover:underline"
                  >
                    {user.email}
                  </a>
                </div>
              )}

              {user.blog && (
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={
                      user.blog.startsWith("http")
                        ? user.blog
                        : `https://${user.blog}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate max-w-[200px]"
                  >
                    {user.blog}
                  </a>
                </div>
              )}

              {user.created_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {formatDate(user.created_at)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center md:justify-start">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  View GitHub Profile
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
