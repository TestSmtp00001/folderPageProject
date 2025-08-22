import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, FolderOpen, Move } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FolderNode } from "@/types/fileManager";

interface MoveToDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderTree: FolderNode[];
  currentFolderId: string | null;
  onMove: (targetFolderId: string | null) => void;
  itemCount: number;
}

export function MoveToDialog({
  open,
  onOpenChange,
  folderTree,
  currentFolderId,
  onMove,
  itemCount,
}: MoveToDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
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

  const handleMove = () => {
    onMove(selectedFolderId);
    setSelectedFolderId(null);
    setExpandedNodes(new Set());
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedFolderId(null);
    setExpandedNodes(new Set());
  };

  const renderFolderNode = (node: FolderNode, depth = 0) => {
    const isExpanded = expandedNodes.has(node.item.id);
    const isSelected = selectedFolderId === node.item.id;
    const isCurrentFolder = currentFolderId === node.item.id;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.item.id}>
        <div 
          className={cn(
            "flex items-center w-full transition-smooth rounded-lg cursor-pointer py-2 px-2 mx-2 my-1",
            isSelected && "bg-primary/10 text-primary font-medium",
            !isSelected && !isCurrentFolder && "hover:bg-secondary",
            isCurrentFolder && "opacity-50 cursor-not-allowed"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (!isCurrentFolder) {
              setSelectedFolderId(node.item.id);
            }
          }}
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
            {isCurrentFolder && (
              <span className="text-xs text-muted-foreground">(current)</span>
            )}
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Move className="h-5 w-5" />
            Move {itemCount} item{itemCount > 1 ? 's' : ''}
          </DialogTitle>
          <DialogDescription>
            Choose a destination folder for the selected items.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ScrollArea className="h-64 w-full border rounded-lg">
            <div className="p-2">
              {/* Root folder option */}
              <div
                className={cn(
                  "flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-smooth mx-2 my-1",
                  selectedFolderId === null && "bg-primary/10 text-primary font-medium",
                  selectedFolderId !== null && "hover:bg-secondary"
                )}
                onClick={() => setSelectedFolderId(null)}
              >
                <FolderOpen className="h-4 w-4 text-primary" />
                <span className="text-sm">Root Folder</span>
              </div>
              
              {/* Folder tree */}
              {folderTree.map((node) => renderFolderNode(node))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleMove}>
            Move Here
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}