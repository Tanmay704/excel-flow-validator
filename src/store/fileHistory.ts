
export interface FileRecord {
  id: string;
  name: string;
  uploadDate: string;
  validationStatus: 'success' | 'error' | 'pending' | 'not_started';
  errorMessage?: string;
}

class FileHistoryStore {
  private static readonly STORAGE_KEY = 'excel_validator_history';

  getHistory(): FileRecord[] {
    const stored = localStorage.getItem(FileHistoryStore.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  addFile(file: FileRecord): void {
    const history = this.getHistory();
    history.unshift(file);
    localStorage.setItem(FileHistoryStore.STORAGE_KEY, JSON.stringify(history.slice(0, 10)));
  }

  updateFileStatus(id: string, status: FileRecord['validationStatus'], errorMessage?: string): void {
    const history = this.getHistory();
    const fileIndex = history.findIndex(f => f.id === id);
    if (fileIndex !== -1) {
      history[fileIndex] = {
        ...history[fileIndex],
        validationStatus: status,
        errorMessage
      };
      localStorage.setItem(FileHistoryStore.STORAGE_KEY, JSON.stringify(history));
    }
  }
}

export const fileHistoryStore = new FileHistoryStore();
