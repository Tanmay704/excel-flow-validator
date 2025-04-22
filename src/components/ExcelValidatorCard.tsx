import React, { useState } from 'react';
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

interface ExcelValidatorCardProps {
  file: File;
  onRemove?: () => void;
}

const ExcelValidatorCard: React.FC<ExcelValidatorCardProps> = ({ file, onRemove }) => {
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

  const resetValidation = () => {
    setIsValidating(false);
    setCurrentStep(1);
    setStepStatuses(Array(5).fill('idle'));
    setValidationResult(null);
  };

  const updateStepStatus = (step: number, status: StepStatus) => {
    setStepStatuses(prev => {
      const updated = [...prev];
      updated[step - 1] = status;
      return updated;
    });
  };

  const startValidation = async () => {
    resetValidation();
    setIsValidating(true);

    try {
      // Get or add FileRecord for this file
      const fileList = fileHistoryStore.getHistory();
      const currentFileRecord = fileList.find(
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
        if (currentFileRecord)
          fileHistoryStore.updateFileStatus(currentFileRecord.id, 'error', step1Result.message);
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
        if (currentFileRecord)
          fileHistoryStore.updateFileStatus(currentFileRecord.id, 'error', step2Result.message);
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
        if (currentFileRecord)
          fileHistoryStore.updateFileStatus(currentFileRecord.id, 'error', step3Result.message);
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
        if (currentFileRecord)
          fileHistoryStore.updateFileStatus(currentFileRecord.id, 'error', step4Result.message);
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
        if (currentFileRecord)
          fileHistoryStore.updateFileStatus(currentFileRecord.id, 'error', step5Result.message);
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
    <div className="w-full max-w-md mx-auto bg-card rounded-xl border border-border shadow-2xl transition-all duration-300 hover:shadow-2xl p-6 glass-morphism flex flex-col items-center justify-between min-h-[440px] relative">
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {file.name}
          </h2>
          {onRemove && (
            <Button variant="outline" size="icon" onClick={onRemove} className="hover:bg-accent">
              &times;
            </Button>
          )}
        </div>
        {!isValidating && !validationResult && (
          <div className="flex flex-col gap-6">
            <div className="text-muted-foreground text-md mb-2">
              {file.name} uploaded.<br/>Click to start validation.
            </div>
            <Button
              onClick={startValidation}
              className="w-full px-6 py-3 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Start Validation
            </Button>
          </div>
        )}
        {(isValidating || validationResult) && (
          <div className="flex flex-col gap-4">
            <div className="text-center space-y-1">
              <p className="text-muted-foreground text-base font-medium">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelValidatorCard;
