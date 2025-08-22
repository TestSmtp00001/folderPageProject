import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  UserPlus,
  Link,
  Copy,
  Settings,
  Trash2,
  Crown,
  Eye,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AccessManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemName: string;
  itemType: 'file' | 'folder';
}

interface UserPermission {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  addedAt: Date;
}

interface TeamPermission {
  id: string;
  name: string;
  memberCount: number;
  role: 'editor' | 'viewer';
  addedAt: Date;
}

interface LinkPermission {
  id: string;
  name: string;
  url: string;
  role: 'editor' | 'viewer';
  expiresAt?: Date;
  isPasswordProtected: boolean;
  createdAt: Date;
}

export function AccessManagementDialog({
  open,
  onOpenChange,
  itemId,
  itemName,
  itemType,
}: AccessManagementDialogProps) {
  const [activeTab, setActiveTab] = useState("people");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<'editor' | 'viewer'>("viewer");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamRole, setNewTeamRole] = useState<'editor' | 'viewer'>("viewer");
  const [linkName, setLinkName] = useState("");
  const [linkRole, setLinkRole] = useState<'editor' | 'viewer'>("viewer");
  const [linkPassword, setLinkPassword] = useState("");
  const [linkExpiry, setLinkExpiry] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);

  // Mock data - in real app, this would come from props or API
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "owner",
      addedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "editor",
      addedAt: new Date("2024-01-20"),
    },
  ]);

  const [teamPermissions, setTeamPermissions] = useState<TeamPermission[]>([
    {
      id: "1",
      name: "Development Team",
      memberCount: 8,
      role: "editor",
      addedAt: new Date("2024-01-10"),
    },
  ]);

  const [linkPermissions, setLinkPermissions] = useState<LinkPermission[]>([
    {
      id: "1",
      name: "Public Share Link",
      url: "https://example.com/share/abc123",
      role: "viewer",
      isPasswordProtected: false,
      createdAt: new Date("2024-01-25"),
    },
  ]);

  const handleAddUser = () => {
    if (!newUserEmail.trim()) return;
    
    const newUser: UserPermission = {
      id: Date.now().toString(),
      name: newUserEmail.split('@')[0],
      email: newUserEmail,
      role: newUserRole,
      addedAt: new Date(),
    };
    
    setUserPermissions([...userPermissions, newUser]);
    setNewUserEmail("");
    setNewUserRole("viewer");
  };

  const handleAddTeam = () => {
    if (!newTeamName.trim()) return;
    
    const newTeam: TeamPermission = {
      id: Date.now().toString(),
      name: newTeamName,
      memberCount: 1,
      role: newTeamRole,
      addedAt: new Date(),
    };
    
    setTeamPermissions([...teamPermissions, newTeam]);
    setNewTeamName("");
    setNewTeamRole("viewer");
  };

  const handleCreateLink = () => {
    if (!linkName.trim()) return;
    
    const newLink: LinkPermission = {
      id: Date.now().toString(),
      name: linkName,
      url: `https://example.com/share/${Date.now()}`,
      role: linkRole,
      isPasswordProtected,
      createdAt: new Date(),
      ...(linkExpiry && { expiresAt: new Date(linkExpiry) }),
    };
    
    setLinkPermissions([...linkPermissions, newLink]);
    setLinkName("");
    setLinkRole("viewer");
    setLinkPassword("");
    setLinkExpiry("");
    setIsPasswordProtected(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'editor':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'viewer':
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'editor':
        return 'Can edit';
      case 'viewer':
        return 'Can view';
      default:
        return role;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manage Access - {itemName}
          </DialogTitle>
          <DialogDescription>
            Manage who can access this {itemType} and what they can do with it.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="people" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              People
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Link
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 max-h-[50vh] overflow-y-auto">
            <TabsContent value="people" className="space-y-4">
              {/* Add User Section */}
              <div className="space-y-3 p-4 border rounded-lg">
                <Label className="text-sm font-medium">Add people</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email address"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={newUserRole} onValueChange={(value: 'editor' | 'viewer') => setNewUserRole(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Can view</SelectItem>
                      <SelectItem value="editor">Can edit</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddUser} size="sm">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* User List */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">People with access</Label>
                {userPermissions.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm">
                        {getRoleIcon(user.role)}
                        {getRoleText(user.role)}
                      </div>
                      {user.role !== 'owner' && (
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="teams" className="space-y-4">
              {/* Add Team Section */}
              <div className="space-y-3 p-4 border rounded-lg">
                <Label className="text-sm font-medium">Add team</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter team name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={newTeamRole} onValueChange={(value: 'editor' | 'viewer') => setNewTeamRole(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Can view</SelectItem>
                      <SelectItem value="editor">Can edit</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddTeam} size="sm">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Team List */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Teams with access</Label>
                {teamPermissions.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{team.name}</div>
                        <div className="text-xs text-gray-500">{team.memberCount} members</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm">
                        {getRoleIcon(team.role)}
                        {getRoleText(team.role)}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              {/* Create Link Section */}
              <div className="space-y-3 p-4 border rounded-lg">
                <Label className="text-sm font-medium">Create share link</Label>
                <div className="space-y-3">
                  <Input
                    placeholder="Link name (optional)"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Select value={linkRole} onValueChange={(value: 'editor' | 'viewer') => setLinkRole(value)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Can view</SelectItem>
                        <SelectItem value="editor">Can edit</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      placeholder="Expiry date (optional)"
                      value={linkExpiry}
                      onChange={(e) => setLinkExpiry(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Password protection</Label>
                    <Switch
                      checked={isPasswordProtected}
                      onCheckedChange={setIsPasswordProtected}
                    />
                  </div>
                  {isPasswordProtected && (
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={linkPassword}
                      onChange={(e) => setLinkPassword(e.target.value)}
                    />
                  )}
                  <Button onClick={handleCreateLink} className="w-full">
                    Create Link
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Link List */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Active share links</Label>
                {linkPermissions.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Link className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{link.name || 'Share Link'}</div>
                        <div className="text-xs text-gray-500 font-mono">{link.url}</div>
                        {link.expiresAt && (
                          <div className="text-xs text-orange-500">
                            Expires: {link.expiresAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm">
                        {getRoleIcon(link.role)}
                        {getRoleText(link.role)}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}