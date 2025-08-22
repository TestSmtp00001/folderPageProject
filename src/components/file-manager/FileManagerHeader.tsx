import { useState } from "react";
import { 
  Search, 
  LayoutGrid, 
  List, 
  Upload, 
  Plus, 
  Download, 
  Trash2, 
  Share2,
  MoreHorizontal,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewMode, SortBy, SortOrder } from "@/types/fileManager";

interface FileManagerHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  selectedCount: number;
  onUploadFile: () => void;
  onCreateFolder: () => void;
  onDownloadSelected: () => void;
  onDeleteSelected: () => void;
  onShareSelected: () => void;
  onMoveSelected: () => void;
  breadcrumbs: Array<{ id: string | null; name: string; }>;
  onBreadcrumbClick: (id: string | null) => void;
}

export function FileManagerHeader({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  sortOrder,
  onSortChange,
  selectedCount,
  onUploadFile,
  onCreateFolder,
  onDownloadSelected,
  onDeleteSelected,
  onShareSelected,
  onMoveSelected,
  breadcrumbs,
  onBreadcrumbClick,
}: FileManagerHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const handleSortClick = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      onSortChange(newSortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(newSortBy, 'asc');
    }
  };

  return (
    <div className="border-b border-border bg-background">
      {/* Breadcrumbs */}
      <div className="px-6 py-3">
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id || 'root'} className="flex items-center">
              {index > 0 && <span className="text-muted-foreground mx-2">/</span>}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBreadcrumbClick(crumb.id)}
                className="h-auto p-1 font-medium text-foreground hover:text-primary"
              >
                {crumb.name}
              </Button>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex space-x-2 items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-secondary/50 border-border focus:bg-background transition-smooth"
            />
          </div>
          {/* Bulk Actions (shown when items are selected) */}
          {selectedCount > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={onMoveSelected}>
                <Share2 className="h-4 w-4 mr-2" />
                Move to ({selectedCount})
              </Button>
              <Button variant="outline" size="sm" onClick={onShareSelected}>
                <Share2 className="h-4 w-4 mr-2" />
                Share ({selectedCount})
              </Button>
              <Button variant="outline" size="sm" onClick={onDownloadSelected}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={onDeleteSelected}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>

        <div className="flex space-x-2 items-center gap-2">
           {/* Sort & Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 flex items-center border border-white">
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => handleSortClick('name')}>
                Sort by Name {sortBy === 'name' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortClick('modified')}>
                Sort by Modified {sortBy === 'modified' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortClick('size')}>
                Sort by Size {sortBy === 'size' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortClick('type')}>
                Sort by Type {sortBy === 'type' && '✓'}
              </DropdownMenuItem>
              {/* 增加升降按钮项 */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={sortOrder === 'asc' ? 'font-semibold' : ''}
              >
                Increase {sortOrder === 'asc' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={sortOrder === 'desc' ? 'font-semibold' : ''}
              >
                Decrease {sortOrder === 'desc' && '✓'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* View Mode Toggle */}
          <div className="flex border border-border rounded-lg p-1 bg-secondary/50 space-x-2">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`h-8 w-8 p-0 flex items-center justify-center rounded-full transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm'
                  : 'bg-transparent hover:bg-gray-100'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className={`h-4 w-4 ${viewMode === 'grid' ? 'text-primary' : 'text-gray-400'}`} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`h-8 w-8 p-0 flex items-center justify-center rounded-full transition-colors ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm'
                  : 'bg-transparent hover:bg-gray-100'
              }`}
              aria-label="List view"
            >
              <List className={`h-4 w-4 ${viewMode === 'list' ? 'text-primary' : 'text-gray-400'}`} />
            </button>
          </div>

          {/* Action Buttons */}
          {/*<Button onClick={onUploadFile} size="sm" className="gap-2 bg-white text-black border border-black hover:bg-black hover:text-white">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-2 bg-primary hover:bg-primary-hover">
                <Plus className="h-4 w-4" />
                New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onCreateFolder}>
                <Plus className="h-4 w-4 mr-2" />
                New Folder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onUploadFile}>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>*/}
        </div>
      </div>
    </div>
  );
}