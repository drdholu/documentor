export interface ProcessingStatus {
  status: 'processing' | 'completed' | 'error';
  message?: string;
  progress?: number;
}

export interface Summary {
  text: string;
  keywords: {
    legalTerms: string[];
    dates: string[];
    names: string[];
    obligations: string[];
  };
  documentId: string;
}

export interface APIError {
  message: string;
  code?: string;
}