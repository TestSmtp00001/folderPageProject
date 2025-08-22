import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, FolderOpen, User, Plus, Calendar, Phone, Mail, FileImage, FileText, Users, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileItem, FolderNode } from "@/types/fileManager";

interface FileManagerSidebarProps {
  folderTree: FolderNode[];
  currentFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onCreateFolder: (parentId?: string) => void;
  currentCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function FileManagerSidebar({
  folderTree,
  currentFolderId,
  onFolderSelect,
  onCreateFolder,
  currentCategory,
  onCategorySelect,
}: FileManagerSidebarProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderFolderNode = (node: FolderNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.item.id);
    const isSelected = currentFolderId === node.item.id;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.item.id}>
        <div 
          className={cn(
            "flex items-center w-full transition-smooth rounded-lg cursor-pointer py-2 px-2 mx-2 my-1",
            isSelected && "text-primary font-medium",
            !isSelected && "hover:bg-file-item-hover"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => onFolderSelect(node.item.id)}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasChildren && (
              <div
                className="h-4 w-4 p-0 hover:bg-secondary rounded flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.item.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </div>
            )}
            {!hasChildren && <div className="w-4" />}
            {isExpanded ? (
              <FolderOpen 
                className={cn(
                  "h-4 w-4", 
                  node.item.color && `text-folder-${node.item.color}`
                )} 
              />
            ) : (
              <Folder 
                className={cn(
                  "h-4 w-4",
                  node.item.color && `text-folder-${node.item.color}`
                )} 
              />
            )}
            <span className="truncate text-sm">{node.item.name}</span>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {node.children.map((child) => renderFolderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Define categories and their icons
  const categories = [
    { id: null, name: 'All Files', icon: <FolderOpen className="h-4 w-4 text-primary" /> },
    { id: 'meetings', name: 'Meetings', icon: <Calendar className="h-4 w-4 text-blue-500" /> },
    { id: 'calls', name: 'Calls', icon: <Phone className="h-4 w-4 text-green-500" /> },
    { id: 'emails', name: 'Emails', icon: <Mail className="h-4 w-4 text-purple-500" /> },
    { id: 'marketing', name: 'Marketing', icon: <FileImage className="h-4 w-4 text-orange-500" /> },
    { id: 'proposals', name: 'Proposals', icon: <FileText className="h-4 w-4 text-yellow-500" /> },
    { id: 'customers', name: 'Customer Documents', icon: <Users className="h-4 w-4 text-indigo-500" /> },
    { id: 'others', name: 'Others', icon: <MoreHorizontal className="h-4 w-4 text-gray-500" /> },
    { id: 'personal', name: 'Personal Files', icon: <User className="h-4 w-4 text-red-500" /> },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex-1 overflow-auto">
        {/* Category selector */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-foreground flex items-center justify-between mb-3">
            Document Categories
          </div>
          <div>
            <div className="space-y-1">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={cn(
                    "flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-smooth",
                    currentCategory === category.id && "text-primary font-medium bg-file-item-selected",
                    currentCategory !== category.id && "hover:bg-file-item-hover"
                  )}
                  onClick={() => onCategorySelect(category.id)}
                >
                  {category.icon}
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Folder tree */}
        <div>
          <div className="text-sm font-semibold text-foreground flex items-center justify-between mb-3">
            Folder Tree
          </div>
          <div>
            <div className="space-y-1">
              <div
                className={cn(
                  "flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-smooth",
                  !currentFolderId && "text-primary font-medium",
                  currentFolderId && "hover:bg-file-item-hover"
                )}
                onClick={() => onFolderSelect(null)}
              >
                <FolderOpen className="h-4 w-4 text-primary" />
                <span>{currentCategory ? categories.find(cat => cat.id === currentCategory)?.name || 'All Files' : 'All Files'}</span>
              </div>
              {folderTree.map((node) => renderFolderNode(node))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}