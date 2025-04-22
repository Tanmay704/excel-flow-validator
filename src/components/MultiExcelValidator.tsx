
import React, { useState } from 'react';
import ExcelValidatorCard from './ExcelValidatorCard';
import FileUpload from './FileUpload';
import { FileRecord, fileHistoryStore } from '@/store/fileHistory';

const MultiExcelValidator: React.FC = () => {
  const [fileRecords, setFileRecords] = useState<File[]>([]);
  const [fileHistory, setFileHistory] = useState<FileRecord[]>(fileHistoryStore.getHistory());

  const handleFilesSelect = (files: File[]) => {
    setFileRecords(prev => [...prev, ...files]);
    files.forEach(file => {
      const fileRecord: FileRecord = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        uploadDate: new Date().toISOString(),
        validationStatus: 'not_started'
      };
      fileHistoryStore.addFile(fileRecord);
    });
    setFileHistory(fileHistoryStore.getHistory());
  };

  const handleRemove = (name: string) => {
    setFileRecords(prev => prev.filter(f => f.name !== name));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background/50 to-secondary/30 py-10">
      <div className="mb-6 w-full max-w-2xl">
        <FileUpload
          onFileSelect={file => handleFilesSelect([file])}
          allowMultiple
        />
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl justify-center">
        {fileRecords.map((file, idx) => (
          <div key={file.name+idx} className="flex flex-col items-center">
            <ExcelValidatorCard
              file={file}
              onRemove={() => handleRemove(file.name)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiExcelValidator;

