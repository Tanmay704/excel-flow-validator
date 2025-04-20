
import React from 'react';
import { FileRecord } from '@/store/fileHistory';
import { FileInput, Clock } from 'lucide-react';
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
        <div className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock size={20} />
            Upload History
          </h2>
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
                  className={`${
                    record.validationStatus === 'success'
                      ? 'text-success hover:text-success'
                      : record.validationStatus === 'error'
                      ? 'text-destructive hover:text-destructive'
                      : ''
                  }`}
                >
                  <FileInput size={16} />
                  <span>{record.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
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
