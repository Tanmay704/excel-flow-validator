
// Simulating API responses with artificial delays
const MOCK_API_DELAY = 1500; // 1.5 seconds

type ValidationResponse = {
  success: boolean;
  message: string;
};

// Simulate API calls with artificial delay and random success/failure
const callValidationApi = (step: number, shouldFail: boolean = false): Promise<ValidationResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          success: false,
          message: `Validation failed at Step ${step}: ${getErrorMessage(step)}`,
        });
      } else {
        resolve({
          success: true,
          message: `Step ${step} validated successfully!`,
        });
      }
    }, MOCK_API_DELAY);
  });
};

// Get a realistic error message based on the step
const getErrorMessage = (step: number): string => {
  const errorMessages = [
    "Invalid file format. Please upload a valid Excel file.",
    "Required headers are missing in the Excel file.",
    "Data type mismatch in columns A, C, and F.",
    "Duplicate entries found in rows 15, 23, and 42.",
    "Reference integrity check failed. Missing related entries.",
  ];
  
  return errorMessages[step - 1] || "Unknown validation error occurred.";
};

// Exported validation functions for each step
export const validateStep1 = (shouldFail: boolean = Math.random() < 0.1): Promise<ValidationResponse> => 
  callValidationApi(1, shouldFail);

export const validateStep2 = (shouldFail: boolean = Math.random() < 0.1): Promise<ValidationResponse> => 
  callValidationApi(2, shouldFail);

export const validateStep3 = (shouldFail: boolean = Math.random() < 0.1): Promise<ValidationResponse> => 
  callValidationApi(3, shouldFail);

export const validateStep4 = (shouldFail: boolean = Math.random() < 0.1): Promise<ValidationResponse> => 
  callValidationApi(4, shouldFail);

export const validateStep5 = (shouldFail: boolean = Math.random() < 0.1): Promise<ValidationResponse> => 
  callValidationApi(5, shouldFail);
