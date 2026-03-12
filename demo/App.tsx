import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { FeedbackProvider, FeedbackWidget } from '../src';

const App = () => {
  // Simulating API backend call
  const handleSendFeedback = async (data: any) => {
    console.log('[API Call] Sending feedback data to server...', data);
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('[API Call] Data successfully saved!');
        resolve();
      }, 1500); // 1.5 seconds artificial delay to show the loading state
    });
  };

  return (
    <FeedbackProvider 
      onSend={handleSendFeedback} 
      settings={{ 
        triggerDelay: 3000, // 3 seconds for demo purposes
        variant: 'emoji',
        storageKey: 'demo_feedback_state'
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ my: 10, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            LibDev UI Test Environment
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Wait 3 seconds to see FeedbackPulse appear in the bottom right corner.
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => {
                // Quick hack to clear the cookie for repeated testing
                document.cookie = 'demo_feedback_state=; Max-Age=0; path=/;';
                window.location.reload();
              }}
            >
              Clear Cookie & Restart
            </Button>
          </Box>
        </Box>
      </Container>

      {/* The visual component rendering the toast and modal */}
      <FeedbackWidget showContactFields={true} />
    </FeedbackProvider>
  );
};

export default App;