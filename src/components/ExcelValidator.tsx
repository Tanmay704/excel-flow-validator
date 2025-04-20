import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import ValidationProgress, { StepStatus } from './ValidationProgress';
import ValidationResults from './ValidationResults';
import { Button } from "@/components/ui/button";
import { 
  validateStep1, 
  validateStep2, 
  validateStep3, 
  validateStep4, 
  validateStep5 
} from '../services/validationApi';
import { useToast } from "@/components/ui/use-toast";
import { fileHistoryStore, FileRecord } from '@/store/fileHistory';

interface ExcelValidatorProps {
  selectedFile?: FileRecord | null;
}

const ExcelValidator: React.FC<ExcelValidatorProps> = ({ selectedFile }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
    Array(5).fill('idle')
  );
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    if (selectedFile) {
      setValidationResult({
        success: selectedFile.validationStatus === 'success',
        message: selectedFile.errorMessage || "Validation completed successfully!",
      });
      setStepStatuses(prev => prev.map(() => 
        selectedFile.validationStatus === 'success' ? 'completed' : 'error'
      ));
    }
  }, [selectedFile]);

  const resetValidation = () => {
    setIsValidating(false);
    setCurrentStep(1);
    setStepStatuses(Array(5).fill('idle'));
    setValidationResult(null);
  };

  const handleFileSelect = (selectedFile: File) => {
    const fileRecord: FileRecord = {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedFile.name,
      uploadDate: new Date().toISOString(),
      validationStatus: 'not_started'
    };
    
    fileHistoryStore.addFile(fileRecord);
    setFile(selectedFile);
    resetValidation();
  };

  const updateStepStatus = (step: number, status: StepStatus) => {
    setStepStatuses(prev => {
      const updated = [...prev];
      updated[step - 1] = status;
      return updated;
    });
  };

  const startValidation = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select an Excel file to validate.",
      });
      return;
    }

    resetValidation();
    setIsValidating(true);

    try {
      const currentFileRecord = fileHistoryStore.getHistory().find(
        record => record.name === file.name
      );

      if (currentFileRecord) {
        fileHistoryStore.updateFileStatus(currentFileRecord.id, 'pending');
      }

      setCurrentStep(1);
      updateStepStatus(1, 'loading');
      const step1Result = await validateStep1();
      
      if (!step1Result.success) {
        updateStepStatus(1, 'error');
        setValidationResult({
          success: false,
          message: step1Result.message,
        });
        return;
      }
      
      updateStepStatus(1, 'completed');
      
      setCurrentStep(2);
      updateStepStatus(2, 'loading');
      const step2Result = await validateStep2();
      
      if (!step2Result.success) {
        updateStepStatus(2, 'error');
        setValidationResult({
          success: false,
          message: step2Result.message,
        });
        return;
      }
      
      updateStepStatus(2, 'completed');
      
      setCurrentStep(3);
      updateStepStatus(3, 'loading');
      const step3Result = await validateStep3();
      
      if (!step3Result.success) {
        updateStepStatus(3, 'error');
        setValidationResult({
          success: false,
          message: step3Result.message,
        });
        return;
      }
      
      updateStepStatus(3, 'completed');
      
      setCurrentStep(4);
      updateStepStatus(4, 'loading');
      const step4Result = await validateStep4();
      
      if (!step4Result.success) {
        updateStepStatus(4, 'error');
        setValidationResult({
          success: false,
          message: step4Result.message,
        });
        return;
      }
      
      updateStepStatus(4, 'completed');
      
      setCurrentStep(5);
      updateStepStatus(5, 'loading');
      const step5Result = await validateStep5();
      
      if (!step5Result.success) {
        updateStepStatus(5, 'error');
        setValidationResult({
          success: false,
          message: step5Result.message,
        });
        return;
      }
      
      updateStepStatus(5, 'completed');
      
      if (currentFileRecord) {
        fileHistoryStore.updateFileStatus(
          currentFileRecord.id,
          'success',
          "All validation steps completed successfully!"
        );
      }
      
      setValidationResult({
        success: true,
        message: "All validation steps completed successfully!",
      });
      
    } catch (error) {
      console.error("Validation error:", error);
      updateStepStatus(currentStep, 'error');
      setValidationResult({
        success: false,
        message: `An unexpected error occurred during validation step ${currentStep}.`,
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {!isValidating && !validationResult && (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Excel Validator</h1>
            <p className="text-gray-600">
              Upload your Excel file to validate its structure and content
            </p>
          </div>
          
          <FileUpload onFileSelect={handleFileSelect} />
          
          {file && (
            <div className="mt-8 text-center">
              <Button 
                onClick={startValidation} 
                className="px-6 py-2 bg-primary hover:bg-primary/90"
              >
                Start Validation
              </Button>
            </div>
          )}
        </>
      )}
      
      {(isValidating || validationResult) && (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Excel Validation Process</h1>
            <p className="text-gray-600">
              {isValidating 
                ? `Validating step ${currentStep} of 5...` 
                : validationResult?.success 
                  ? "All validation steps completed successfully!"
                  : "Validation process completed with errors."
              }
            </p>
          </div>
          
          <ValidationProgress 
            currentStep={currentStep}
            stepStatuses={stepStatuses}
          />
          
          {validationResult && (
            <ValidationResults 
              success={validationResult.success}
              message={validationResult.message}
            />
          )}
          
          {validationResult && (
            <div className="mt-8 text-center">
              <Button 
                onClick={() => {
                  setFile(null);
                  resetValidation();
                }}
                variant="outline"
                className="px-6 py-2"
              >
                Upload Another File
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExcelValidator;
