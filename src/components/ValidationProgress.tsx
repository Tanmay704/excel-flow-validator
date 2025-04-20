
import React from 'react';
import { Check, X, Loader } from 'lucide-react';

export type StepStatus = 'idle' | 'loading' | 'completed' | 'error';

interface ValidationProgressProps {
  currentStep: number;
  stepStatuses: StepStatus[];
}

const STEP_TITLES = [
  'File Format Validation',
  'Header Validation',
  'Data Type Validation',
  'Duplicate Check',
  'Reference Validation'
];

const ValidationProgress: React.FC<ValidationProgressProps> = ({ currentStep, stepStatuses }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        {STEP_TITLES.map((title, index) => {
          const stepNumber = index + 1;
          const status = stepStatuses[index];
          
          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div 
                  className={`progress-step ${
                    status === 'loading' ? 'active' :
                    status === 'completed' ? 'completed' :
                    status === 'error' ? 'error' : ''
                  }`}
                >
                  {status === 'loading' ? (
                    <Loader size={20} className="animate-spin" />
                  ) : status === 'completed' ? (
                    <Check size={20} />
                  ) : status === 'error' ? (
                    <X size={20} />
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="mt-2 text-xs text-center w-28 lg:w-32">
                  {title}
                </div>
              </div>
              
              {stepNumber < 5 && (
                <div 
                  className={`progress-line ${
                    stepStatuses.slice(0, stepNumber).every(s => s === 'completed') ? 'completed' : ''
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ValidationProgress;
