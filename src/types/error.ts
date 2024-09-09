export interface CustomError {
  message: string;
  displayType: 'inline' | 'toast' | 'none';
  category: 'auth' | 'validation' | 'general' | 'server' | 'network' | 'search';
}

export interface ErrorState {
  error: CustomError | null;
}

export interface ErrorContextType {
  errorState: ErrorState;
  addError: (error: CustomError) => void;
  clearError: () => void;
}
