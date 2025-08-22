export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatDate(date: Date | undefined): string {
  if (!date) {
    return 'Unknown';
  }
  
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function sortItems<T extends { name: string; modifiedDate?: Date; size?: number; type: string }>(
  items: T[],
  sortBy: 'name' | 'modified' | 'size' | 'type',
  sortOrder: 'asc' | 'desc'
): T[] {
  const sorted = [...items].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'modified':
        const aTime = a.modifiedDate?.getTime() || 0;
        const bTime = b.modifiedDate?.getTime() || 0;
        comparison = aTime - bTime;
        break;
      case 'size':
        const aSize = a.size || 0;
        const bSize = b.size || 0;
        comparison = aSize - bSize;
        break;
      case 'type':
        // Folders first, then files
        if (a.type === 'folder' && b.type === 'file') comparison = -1;
        else if (a.type === 'file' && b.type === 'folder') comparison = 1;
        else comparison = a.name.localeCompare(b.name);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
}