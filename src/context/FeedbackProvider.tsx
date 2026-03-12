import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useFeedbackLogic } from '../hooks/useFeedbackLogic';
import { FeedbackSettings, FeedbackTranslations } from '../types';

interface FeedbackContextType {
  isVisible: boolean;
  onDismiss: () => void;
  onComplete: (data: any) => Promise<void>;
  settings?: FeedbackSettings;
  translations: Required<FeedbackTranslations>;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export interface FeedbackProviderProps {
  children: ReactNode;
  onSend: (data: any) => Promise<void>;
  settings?: FeedbackSettings;
}

const DEFAULT_TRANSLATIONS: Required<FeedbackTranslations> = {
  toastTitle: 'How would you rate your experience?',
  modalTitle: 'Thank you for your rating!',
  modalDescription: 'We would love to hear more details. Your feedback helps us improve.',
  feedbackPlaceholder: 'Write your ideas or suggestions here...',
  emailLabel: 'Email (optional)',
  emailPlaceholder: 'Enter your email for follow-up',
  cancelButton: 'Cancel',
  submitButton: 'Submit',
  submittingButton: 'Submitting...',
  closeAriaLabel: 'Close'
};

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ 
  children, 
  onSend, 
  settings 
}) => {
  const { isVisible, onDismiss, onComplete: logicOnComplete } = useFeedbackLogic(settings);

  // Сливаме подадените преводи с тези по подразбиране
  const translations = useMemo(() => {
    return { ...DEFAULT_TRANSLATIONS, ...(settings?.translations || {}) };
  }, [settings?.translations]);

  const handleComplete = async (data: any) => {
    try {
      await onSend(data); 
      logicOnComplete();  
    } catch (error) {
      console.error('[FeedbackPulse] Failed to send feedback data:', error);
    }
  };

  return (
    <FeedbackContext.Provider 
      value={{ 
        isVisible, 
        onDismiss, 
        onComplete: handleComplete, 
        settings,
        translations 
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedbackContext = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedbackContext must be used within a FeedbackProvider');
  }
  return context;
};