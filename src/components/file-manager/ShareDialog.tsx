import { useState } from "react";
import { Share2, Users, User, Link, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Team } from "@/types/fileManager";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: Team[];
  onShare: (shareData: { users: string[], teams: string[], copyLink: boolean }) => void;
  itemCount: number;
}

// Mock users data
const mockUsers = [
  { id: "user1", name: "Alice Chen", email: "alice@company.com", avatar: "AC" },
  { id: "user2", name: "Bob Smith", email: "bob@company.com", avatar: "BS" },
  { id: "user3", name: "Carol Williams", email: "carol@company.com", avatar: "CW" },
  { id: "user4", name: "David Brown", email: "david@company.com", avatar: "DB" },
  { id: "user5", name: "Eva Davis", email: "eva@company.com", avatar: "ED" },
];

export function ShareDialog({
  open,
  onOpenChange,
  teams,
  onShare,
  itemCount,
}: ShareDialogProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [copyLink, setCopyLink] = useState(false);

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserToggle = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleTeamToggle = (teamId: string) => {
    const newSelected = new Set(selectedTeams);
    if (newSelected.has(teamId)) {
      newSelected.delete(teamId);
    } else {
      newSelected.add(teamId);
    }
    setSelectedTeams(newSelected);
  };

  const handleShare = () => {
    onShare({
      users: Array.from(selectedUsers),
      teams: Array.from(selectedTeams),
      copyLink,
    });
    
    // Reset state
    setSelectedUsers(new Set());
    setSelectedTeams(new Set());
    setSearchQuery("");
    setCopyLink(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedUsers(new Set());
    setSelectedTeams(new Set());
    setSearchQuery("");
    setCopyLink(false);
  };

  const totalSelected = selectedUsers.size + selectedTeams.size;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share {itemCount} item{itemCount > 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription>
            Choose who can access the selected items.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div>
            <Label htmlFor="search">Search users and teams</Label>
            <Input
              id="search"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Selected items summary */}
          {totalSelected > 0 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedUsers).map(userId => {
                const user = mockUsers.find(u => u.id === userId);
                return user ? (
                  <Badge key={userId} variant="secondary" className="gap-1">
                    <User className="h-3 w-3" />
                    {user.name}
                  </Badge>
                ) : null;
              })}
              {Array.from(selectedTeams).map(teamId => {
                const team = teams.find(t => t.id === teamId);
                return team ? (
                  <Badge key={teamId} variant="secondary" className="gap-1">
                    <Users className="h-3 w-3" />
                    {team.name}
                  </Badge>
                ) : null;
              })}
            </div>
          )}

          {/* Users and Teams List */}
          <ScrollArea className="h-64 w-full border rounded-lg">
            <div className="p-4 space-y-4">
              {/* Users Section */}
              {filteredUsers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Users
                  </h4>
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary cursor-pointer"
                        onClick={() => handleUserToggle(user.id)}
                      >
                        <Checkbox
                          checked={selectedUsers.has(user.id)}
                          onCheckedChange={() => handleUserToggle(user.id)}
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {user.avatar}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teams Section */}
              {filteredTeams.length > 0 && (
                <div>
                  {filteredUsers.length > 0 && <Separator className="my-4" />}
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Teams
                  </h4>
                  <div className="space-y-2">
                    {filteredTeams.map((team) => (
                      <div
                        key={team.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary cursor-pointer"
                        onClick={() => handleTeamToggle(team.id)}
                      >
                        <Checkbox
                          checked={selectedTeams.has(team.id)}
                          onCheckedChange={() => handleTeamToggle(team.id)}
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <Users className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{team.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {team.memberCount} members • {team.isPublic ? 'Public' : 'Private'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredUsers.length === 0 && filteredTeams.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No users or teams found</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Copy Link Option */}
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <Checkbox
              id="copyLink"
              checked={copyLink}
              onCheckedChange={setCopyLink}
            />
            <div className="flex items-center gap-2 flex-1">
              <Link className="h-4 w-4" />
              <Label htmlFor="copyLink" className="text-sm cursor-pointer">
                Copy shareable link to clipboard
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare}
            disabled={totalSelected === 0 && !copyLink}
          >
            Share {totalSelected > 0 && `with ${totalSelected}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}