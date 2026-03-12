import React from 'react';
import { Paper, Typography, IconButton } from '@mui/material';
import { ThumbsUp, ThumbsDown, Smile, Meh, Frown, X } from 'lucide-react';
import { useFeedbackContext } from '../context/FeedbackProvider';

export interface FeedbackToastProps {
  onRate: (rating: string | number) => void;
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({ onRate }) => {
  const { isVisible, onDismiss, settings, translations } = useFeedbackContext();

  if (!isVisible) {
    return null;
  }

  const variant = settings?.variant || 'emoji';

  return (
    <div className="ld-fp-fixed ld-fp-bottom-6 ld-fp-right-6 ld-fp-z-[9999] ld-fp-animate-fade-in-up">
      <Paper 
        elevation={4} 
        className="ld-fp-p-5 ld-fp-rounded-xl ld-fp-flex ld-fp-flex-col ld-fp-gap-4 ld-fp-min-w-[280px] ld-fp-border ld-fp-border-solid ld-fp-border-gray-100 dark:ld-fp-border-gray-800"
      >
        <div className="ld-fp-flex ld-fp-justify-between ld-fp-items-start ld-fp-gap-4">
          <Typography variant="subtitle1" fontWeight="600" className="ld-fp-mt-1">
            {translations.toastTitle}
          </Typography>
          
          <IconButton 
            size="small" 
            onClick={onDismiss}
            className="ld-fp--mt-2 ld-fp--mr-2 ld-fp-text-gray-400 hover:ld-fp-text-gray-600"
            aria-label={translations.closeAriaLabel}
          >
            <X size={18} />
          </IconButton>
        </div>

        <div className="ld-fp-flex ld-fp-justify-center ld-fp-items-center ld-fp-gap-6 ld-fp-mt-2">
          {variant === 'binary' ? (
            <React.Fragment>
              <IconButton 
                color="error" 
                onClick={() => onRate('down')}
                className="hover:ld-fp-scale-110 ld-fp-transition-transform"
              >
                <ThumbsDown size={28} />
              </IconButton>
              <IconButton 
                color="success" 
                onClick={() => onRate('up')}
                className="hover:ld-fp-scale-110 ld-fp-transition-transform"
              >
                <ThumbsUp size={28} />
              </IconButton>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <IconButton 
                color="error" 
                onClick={() => onRate(1)}
                className="hover:ld-fp-scale-110 ld-fp-transition-transform"
              >
                <Frown size={32} />
              </IconButton>
              <IconButton 
                color="warning" 
                onClick={() => onRate(3)}
                className="hover:ld-fp-scale-110 ld-fp-transition-transform"
              >
                <Meh size={32} />
              </IconButton>
              <IconButton 
                color="success" 
                onClick={() => onRate(5)}
                className="hover:ld-fp-scale-110 ld-fp-transition-transform"
              >
                <Smile size={32} />
              </IconButton>
            </React.Fragment>
          )}
        </div>
      </Paper>
    </div>
  );
};