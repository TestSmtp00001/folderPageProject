import { useState, useEffect } from "react";
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
import { FileItem } from "@/types/fileManager";

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FileItem | null;
  onRename: (id: string, newName: string) => void;
}

export function RenameDialog({
  open,
  onOpenChange,
  item,
  onRename,
}: RenameDialogProps) {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (item) {
      // Remove file extension for files when editing
      if (item.type === 'file') {
        const lastDotIndex = item.name.lastIndexOf('.');
        if (lastDotIndex > 0) {
          setNewName(item.name.substring(0, lastDotIndex));
        } else {
          setNewName(item.name);
        }
      } else {
        setNewName(item.name);
      }
    }
  }, [item]);

  const handleRename = () => {
    if (!item || !newName.trim()) return;
    
    let finalName = newName.trim();
    
    // Add back file extension for files
    if (item.type === 'file') {
      const lastDotIndex = item.name.lastIndexOf('.');
      if (lastDotIndex > 0) {
        const extension = item.name.substring(lastDotIndex);
        finalName = finalName + extension;
      }
    }
    
    onRename(item.id, finalName);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename {item?.type === 'folder' ? 'Folder' : 'File'}</DialogTitle>
          <DialogDescription>
            Enter a new name for "{item?.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="col-span-3"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={!newName.trim()}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}