import React, { useState } from 'react';
import { FeedbackToast } from './FeedbackToast';
import { FeedbackModal } from './FeedbackModal';

export interface FeedbackWidgetProps {
  showContactFields?: boolean;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ 
  showContactFields = false 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<string | number | null>(null);

  // Когато потребителят кликне на емотикон в малкото прозорче
  const handleRate = (rating: string | number) => {
    setSelectedRating(rating);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRating(null);
  };

  return (
    <React.Fragment>
      {/* Малкото прозорче долу вдясно */}
      <FeedbackToast onRate={handleRate} />

      {/* Детайлният прозорец, който се отваря след клик */}
      <FeedbackModal 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        initialRating={selectedRating}
        showContactFields={showContactFields}
      />
    </React.Fragment>
  );
};