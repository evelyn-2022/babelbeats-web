export interface CustomError {
  type: string;
  message: string;
  displayType: 'inline' | 'toast';
  category: 'auth' | 'validation' | 'general';
}

export interface ErrorState {
  error: CustomError | null;
}

export interface ErrorContextType {
  errorState: ErrorState;
  addError: (error: CustomError) => void;
  clearError: () => void;
}
