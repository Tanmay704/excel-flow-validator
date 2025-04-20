
import React, { useState, useRef, DragEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Check, X, FileInput } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isExcelFile = (file: File): boolean => {
    return file.name.endsWith('.xlsx') || 
           file.name.endsWith('.xls') || 
           file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
           file.type === 'application/vnd.ms-excel';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (isExcelFile(selectedFile)) {
        setFile(selectedFile);
        onFileSelect(selectedFile);
        toast({
          title: "File Selected",
          description: `${selectedFile.name} has been selected.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File",
          description: "Please select a valid Excel file (.xlsx or .xls).",
        });
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (isExcelFile(droppedFile)) {
        setFile(droppedFile);
        onFileSelect(droppedFile);
        toast({
          title: "File Selected",
          description: `${droppedFile.name} has been selected.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File",
          description: "Please select a valid Excel file (.xlsx or .xls).",
        });
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`file-drop-area ${isDragging ? 'drag-active' : ''} ${file ? 'border-success bg-green-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={file ? undefined : triggerFileInput}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          className="hidden"
        />
        
        {file ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <FileInput size={24} className="text-success" />
              <span className="font-medium text-gray-800 break-all">{file.name}</span>
              <button 
                onClick={(e) => { 
                  e.stopPropagation();
                  removeFile();
                }}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-success mr-1" />
              <span className="text-success">File ready for validation</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload size={48} className="text-gray-400 mb-3" />
            <p className="text-lg font-medium mb-2">Drag and drop your Excel file here</p>
            <p className="text-gray-500 mb-4">or click to browse</p>
            <Button type="button" variant="outline" onClick={triggerFileInput}>
              <FileInput size={16} className="mr-2" />
              Select Excel File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
