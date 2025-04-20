
import React from 'react';
import { FileRecord } from '@/store/fileHistory';
import { Files, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface HistorySidebarProps {
  history: FileRecord[];
  onFileSelect: (record: FileRecord) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onFileSelect }) => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <History size={20} className="text-muted-foreground" />
          <h2 className="text-lg font-semibold">Upload History</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Files</SidebarGroupLabel>
          <SidebarMenu>
            {history.map((record) => (
              <SidebarMenuItem key={record.id}>
                <SidebarMenuButton
                  onClick={() => onFileSelect(record)}
                  className={cn(
                    "w-full",
                    record.validationStatus === 'success' && "text-success hover:text-success/90",
                    record.validationStatus === 'error' && "text-destructive hover:text-destructive/90",
                    record.validationStatus === 'pending' && "text-muted-foreground"
                  )}
                >
                  <Files size={16} />
                  <span className="truncate">{record.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(record.uploadDate).toLocaleDateString()}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default HistorySidebar;
