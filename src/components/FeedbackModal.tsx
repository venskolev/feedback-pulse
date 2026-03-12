import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  IconButton, 
  Typography,
  CircularProgress
} from '@mui/material';
import { X } from 'lucide-react';
import { useFeedbackContext } from '../context/FeedbackProvider';

export interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  initialRating: string | number | null;
  showContactFields?: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  open, 
  onClose, 
  initialRating,
  showContactFields = false 
}) => {
  const { onComplete, translations } = useFeedbackContext();
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete({
        rating: initialRating,
        comment: comment.trim(),
        email: email.trim() ? email.trim() : undefined,
        timestamp: new Date().toISOString()
      });
      
      setComment('');
      setEmail('');
      onClose();
    } catch (error) {
      console.error('[FeedbackPulse] Data submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!isSubmitting ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "ld-fp-rounded-xl"
      }}
    >
      <DialogTitle className="ld-fp-flex ld-fp-justify-between ld-fp-items-center ld-fp-pr-2">
        <Typography variant="h6" fontWeight="600">
          {translations.modalTitle}
        </Typography>
        <IconButton 
          onClick={onClose} 
          disabled={isSubmitting}
          className="ld-fp-text-gray-400 hover:ld-fp-text-gray-600"
          aria-label={translations.closeAriaLabel}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers className="ld-fp-flex ld-fp-flex-col ld-fp-gap-4 ld-fp-p-6">
        <Typography variant="body2" color="text.secondary" className="ld-fp-mb-2">
          {translations.modalDescription}
        </Typography>

        <TextField
          label={translations.feedbackPlaceholder}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
          placeholder={translations.feedbackPlaceholder}
        />

        {showContactFields && (
          <TextField
            label={translations.emailLabel}
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            placeholder={translations.emailPlaceholder}
            className="ld-fp-mt-2"
          />
        )}
      </DialogContent>
      
      <DialogActions className="ld-fp-p-4 ld-fp-px-6">
        <Button 
          onClick={onClose} 
          color="inherit" 
          disabled={isSubmitting}
        >
          {translations.cancelButton}
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isSubmitting || (comment.trim() === '' && !initialRating)}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? translations.submittingButton : translations.submitButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};