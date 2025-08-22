import { useState, useMemo } from "react";
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
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileItem, FolderNode } from "@/types/fileManager";

interface CopyToDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: string[];
  files: FileItem[];
  onCopy: (targetFolderId: string | null) => void;
}

export function CopyToDialog({
  open,
  onOpenChange,
  items,
  files,
  onCopy,
}: CopyToDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Build folder tree excluding the items being copied
  const folderTree = useMemo(() => {
    const buildTree = (parentId?: string): FolderNode[] => {
      const folders = files.filter(
        file => 
          file.type === 'folder' && 
          file.parentId === parentId &&
          !items.includes(file.id) // Exclude folders being copied
      );

      return folders.map(folder => ({
        item: folder,
        children: buildTree(folder.id),
      }));
    };

    return buildTree();
  }, [files, items]);

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
    const isSelected = selectedFolderId === node.item.id;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.item.id}>
        <div 
          className={cn(
            "flex items-center w-full transition-smooth rounded-lg cursor-pointer py-2 px-2 mx-2 my-1",
            isSelected && "bg-primary/10 text-primary font-medium",
            !isSelected && "hover:bg-secondary"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => setSelectedFolderId(node.item.id)}
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

  const handleCopy = () => {
    onCopy(selectedFolderId);
    setSelectedFolderId(null);
    setExpandedNodes(new Set());
  };

  const itemNames = items.map(id => 
    files.find(f => f.id === id)?.name
  ).filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[600px]">
        <DialogHeader>
          <DialogTitle>Copy Items</DialogTitle>
          <DialogDescription>
            Choose a destination folder for {itemNames.length} item{itemNames.length > 1 ? 's' : ''}:
            {itemNames.slice(0, 3).map((name, index) => (
              <span key={index}> "{name}"{index < Math.min(itemNames.length - 1, 2) ? ',' : ''}</span>
            ))}
            {itemNames.length > 3 && ` and ${itemNames.length - 3} more`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="border rounded-lg">
            <div 
              className={cn(
                "flex items-center w-full transition-smooth rounded-t-lg cursor-pointer py-3 px-4 border-b",
                selectedFolderId === null && "bg-primary/10 text-primary font-medium",
                selectedFolderId !== null && "hover:bg-secondary"
              )}
              onClick={() => setSelectedFolderId(null)}
            >
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                <span className="text-sm">Root Folder</span>
              </div>
            </div>
            
            <ScrollArea className="h-[300px]">
              {folderTree.length > 0 ? (
                folderTree.map((node) => renderFolderNode(node))
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No folders available
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCopy}>
            Copy Here
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}