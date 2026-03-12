export interface FeedbackTranslations {
  toastTitle?: string;
  modalTitle?: string;
  modalDescription?: string;
  feedbackPlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  cancelButton?: string;
  submitButton?: string;
  submittingButton?: string;
  closeAriaLabel?: string;
}

export interface FeedbackSettings {
  triggerDelay?: number;         
  storageKey?: string;           
  cookieExpiryDays?: number;     
  backoffSchedule?: number[];    
  variant?: 'binary' | 'emoji';  
  translations?: FeedbackTranslations; // Новият пропс за преводи
}

export interface FeedbackCookieState {
  dismissCount: number;
  lastSeen: number;
  status: 'active' | 'dismissed' | 'aggressive' | 'completed';
}