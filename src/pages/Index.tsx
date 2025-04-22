
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import MultiExcelValidator from "@/components/MultiExcelValidator";
import HistorySidebar from "@/components/HistorySidebar";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileRecord, fileHistoryStore } from "@/store/fileHistory";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [history, setHistory] = useState<FileRecord[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = storedTheme === 'dark' || (!storedTheme && prefersDark);
    setIsDarkMode(initialDarkMode);
    document.documentElement.classList.toggle('dark', initialDarkMode);

    setHistory(fileHistoryStore.getHistory());
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleFileSelect = (record: FileRecord) => {
    setSelectedFile(record);
    toast({
      title: "File Selected",
      description: `Viewing results for ${record.name}`,
    });
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex flex-col bg-background transition-colors duration-150">
        <header className="bg-card border-b border-border py-4 transition-colors duration-150">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-foreground">Excel Flow Validator</h1>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="rounded-full"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 flex">
          <HistorySidebar history={history} onFileSelect={handleFileSelect} />
          <main className="flex-1 flex flex-col items-center justify-center bg-background">
            <MultiExcelValidator />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
