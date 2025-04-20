
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface ValidationResultsProps {
  success: boolean;
  message: string;
}

const ValidationResults: React.FC<ValidationResultsProps> = ({ success, message }) => {
  return (
    <div className={`
      border rounded-lg p-6 mt-6 
      ${success ? 'border-success bg-green-50' : 'border-error bg-red-50'}
    `}>
      <div className="flex items-start">
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${success ? 'bg-success' : 'bg-error'} 
        `}>
          {success ? (
            <Check size={24} className="text-white" />
          ) : (
            <AlertCircle size={24} className="text-white" />
          )}
        </div>
        
        <div className="ml-4">
          <h3 className={`text-lg font-medium ${success ? 'text-success' : 'text-error'}`}>
            {success ? 'Validation Successful!' : 'Validation Failed'}
          </h3>
          <p className="mt-1 text-gray-600">{message}</p>
          
          {success && (
            <div className="mt-4">
              <p className="text-gray-700 font-medium">Your Excel file has passed all validation checks.</p>
              <p className="text-gray-600 mt-2">
                The data is now ready for further processing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationResults;
