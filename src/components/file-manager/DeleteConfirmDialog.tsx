import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileItem } from "@/types/fileManager";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: FileItem[];
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  items,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const itemCount = items.length;
  const hasFiles = items.some(item => item.type === 'file');
  const hasFolders = items.some(item => item.type === 'folder');

  const getTitle = () => {
    if (itemCount === 1) {
      return `Delete ${items[0].type === 'folder' ? 'Folder' : 'File'}`;
    }
    return `Delete ${itemCount} Items`;
  };

  const getDescription = () => {
    if (itemCount === 1) {
      const item = items[0];
      return `Are you sure you want to delete ${item.type === 'folder' ? 'folder' : 'file'} "${item.name}"? This action cannot be undone.`;
    }
    
    let description = `Are you sure you want to delete these ${itemCount} items?`;
    if (hasFolders) {
      description += ' Folders and all their contents will be permanently deleted.';
    }
    description += ' This action cannot be undone.';
    return description;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
          <AlertDialogDescription>
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}