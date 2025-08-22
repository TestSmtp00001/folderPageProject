export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modifiedAt?: Date;
  createdAt?: Date;
  modifiedDate?: Date;
  modifiedBy?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  parentId?: string;
  isShared: boolean;
  permissions?: Permission[];
  teamId?: string;
  dealId?: string;
  ownerId?: string;
  isTeamFile?: boolean;
  category?: 'meetings' | 'calls' | 'emails' | 'marketing' | 'proposals' | 'customers' | 'others' | 'personal' | 'transcripts' | 'recordings' | 'documents' | 'images' | 'videos' | 'audio' | 'archives' | 'other' | string | null;
  fileType?: string;
  url?: string;
}

export interface Permission {
  userId: string;
  role: 'viewer' | 'editor' | 'admin';
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
  memberCount: number;
  isPublic: boolean;
}

export interface Deal {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'closed';
  value: number;
  company: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'member';
  teams: string[];
}

export interface FolderNode {
  item: FileItem;
  children: FolderNode[];
  isExpanded: boolean;
}

export type ViewMode = 'grid' | 'list';
export type SortBy = 'name' | 'modified' | 'size' | 'type';
export type SortOrder = 'asc' | 'desc';