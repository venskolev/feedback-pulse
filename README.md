# @libdev-ui/feedback-pulse

A smart, non-intrusive, and dynamic feedback/survey widget for React applications. Designed to collect user feedback efficiently without degrading the user experience (UX).

Built with **Material UI (MUI)** for seamless theme integration and **Tailwind CSS** (fully isolated via prefixes) for perfect layout control. 100% GDPR-compliant by default.

## ✨ Features

- **Smart "Aggressive Backoff" Algorithm:** Automatically adjusts the frequency of the prompt based on user dismissals (e.g., waits 24 hours after the first dismiss, 7 days after the second, and then switches to an aggressive 5-minute interval).
- **GDPR Compliant:** Fully anonymous by default. Uses only first-party cookies to track interaction state. No IP tracking, no personal data collection unless explicitly requested.
- **Theme Inheritance:** Automatically inherits your application's MUI theme (fonts, colors, shapes).
- **Style Isolation:** Uses a strict `ld-fp-` prefix for all internal Tailwind classes to guarantee zero conflicts with your app's global CSS.
- **Fully Localizable:** Provide your own translations for all UI texts via props.

## 📦 Installation

This package requires `react`, `react-dom`, and `@mui/material` as peer dependencies.

npm install @libdev-ui/feedback-pulse

### Using Yarn

yarn add @libdev-ui/feedback-pulse

### Using PNPM

pnpm add @libdev-ui/feedback-pulse

## 🚀 Quick Start

Wrap your application (or a specific part of it) with the `FeedbackProvider`, and place the `FeedbackWidget` where you want it to render.

import React from 'react';
import { FeedbackProvider, FeedbackWidget } from '@libdev-ui/feedback-pulse';
// The isolated CSS is automatically imported by the library

const App = () => {
  // Your API submission logic
  const handleSendFeedback = async (data) => {
    await fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return (
    <FeedbackProvider
      onSend={handleSendFeedback}
      settings={{
        triggerDelay: 30000, // Show after 30 seconds
        variant: 'emoji',    // 'emoji' or 'binary' (thumbs up/down)
      }}
    >
      ```jsx
      <YourMainAppContent />
      ```

      {/* Renders the toast and modal */}
      <FeedbackWidget showContactFields={false} />
    </FeedbackProvider>
  );
};

export default App;

## ⚙️ Configuration (API Reference)

### `FeedbackProvider` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `onSend` | `(data: any) => Promise<void>` | **Required** | The function called when the user submits the form. The library waits for this promise to resolve before setting the success cookie. |
| `settings` | `FeedbackSettings` | `{}` | Optional configuration object for logic and UI variants. |

### `FeedbackSettings` Object

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `triggerDelay` | `number` | `30000` | Initial delay (in ms) before showing the widget to new users. |
| `storageKey` | `string` | `'ld_fp_state'` | The name of the cookie used to store the interaction state. |
| `cookieExpiryDays` | `number` | `90` | How many days to wait before asking again after a successful submission. |
| `backoffSchedule` | `number[]` | `[86400, 604800, 300]` | Array of delays (in seconds) after each dismissal. |
| `variant` | `'emoji' \| 'binary'` | `'emoji'` | The visual rating style. |
| `translations` | `object` | English defaults | Override any text in the UI (see Translations section). |

### `FeedbackWidget` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `showContactFields` | `boolean` | `false` | If true, renders an optional Email input field in the modal. |

## 🌍 Translations

You can easily localize the widget by passing a `translations` object to the `settings` prop:

<FeedbackProvider
  onSend={handleSendFeedback}
  settings={{
    translations: {
      toastTitle: 'Wie würden Sie unser Design bewerten?',
      modalTitle: 'Vielen Dank für Ihre Bewertung!',
      modalDescription: 'Wir würden uns freuen, mehr Details zu erfahren.',
      cancelButton: 'Abbrechen',
      submitButton: 'Senden',
      // ...
    }
  }}
>

## 📄 License

MIT © LibDev
