# @libdev-ui/feedback-pulse

Smart, non-intrusive, and dynamic feedback widget for React applications.
Collect user insights with a privacy-first approach and a professional Material UI based experience.

## Features

- Intelligent display logic with configurable backoff scheduling
- Material UI integration that follows your existing theme
- Isolated Tailwind styling with the `ld-fp-` prefix to avoid collisions
- Fully localizable UI text
- GDPR-friendly, first-party cookie based state handling
- Simple provider + widget integration

## Installation

This package requires `react`, `react-dom`, and `@mui/material` as peer dependencies.

```bash
pnpm add @libdev-ui/feedback-pulse
```

or

```bash
npm install @libdev-ui/feedback-pulse
```

## Quick Start

Wrap your app with `FeedbackProvider` and render `FeedbackWidget` once near the root of your application.

```tsx
import React from 'react';
import {
  FeedbackProvider,
  FeedbackWidget,
} from '@libdev-ui/feedback-pulse';

async function handleSendFeedback(data: unknown) {
  await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export default function App() {
  return (
    <FeedbackProvider
      onSend={handleSendFeedback}
      settings={{
        triggerDelay: 30000,
        variant: 'emoji',
      }}
    >
      <main>{/* Your application */}</main>
      <FeedbackWidget showContactFields />
    </FeedbackProvider>
  );
}
```

## How It Works

The widget uses a configurable backoff strategy to avoid interrupting users too often.
After dismissals, the next display is delayed according to your configured schedule.
After successful submission, the widget stays hidden until the cookie expiration window ends.

Default backoff schedule:

- 24 hours after the first dismissal
- 7 days after the second dismissal
- 5 minutes for aggressive follow-up mode

## API

### `FeedbackProvider`

Provides feedback state, timing logic, and submission handling.

#### Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `onSend` | `(data: any) => Promise<void>` | Yes | — | Called when feedback is submitted. Success state is applied only after the promise resolves. |
| `settings` | `FeedbackSettings` | No | `{}` | Optional logic, display, translation, and storage configuration. |

### `FeedbackSettings`

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `triggerDelay` | `number` | `30000` | Delay in milliseconds before the widget appears for new users. |
| `storageKey` | `string` | `'ld_fp_state'` | Name of the cookie used to store widget state. |
| `cookieExpiryDays` | `number` | `90` | Number of days before users may be asked again after successful feedback. |
| `backoffSchedule` | `number[]` | `[86400, 604800, 300]` | Delay values in seconds applied after dismissals. |
| `variant` | `'emoji' \| 'binary'` | `'emoji'` | Visual style for the initial prompt. |
| `translations` | `object` | English defaults | Overrides any UI text for localization. |

### `FeedbackWidget`

Renders the visible UI for the toast and modal flow.

#### Props Contact

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `showContactFields` | `boolean` | No | `false` | Enables optional contact fields such as email in the feedback modal. |

## Localization

All visible text can be overridden through `settings.translations`.

```tsx
<FeedbackProvider
  onSend={handleSendFeedback}
  settings={{
    translations: {
      toastTitle: 'How would you rate your experience?',
      submitButton: 'Send Feedback',
      // Override additional labels as needed
    },
  }}
>
  <FeedbackWidget />
</FeedbackProvider>
```

Check the exported TypeScript types in the package for the full list of available translation keys.

## Theming

`@libdev-ui/feedback-pulse` is designed to work naturally with Material UI applications.
It inherits theme values such as colors, typography, and border radius so the widget feels native inside your interface.

## Style Isolation

The package uses prefixed Tailwind utility classes with the `ld-fp-` namespace.
This prevents conflicts with your application styles and avoids leakage from existing global Tailwind or CSS rules.

Example:

- `flex` becomes `ld-fp-flex`
- `rounded-lg` becomes `ld-fp-rounded-lg`

## Privacy and GDPR

The library follows a privacy-first approach.
By default, it does not track personal data, analytics identifiers, or third-party cookies.

It uses a single first-party cookie to store widget interaction state such as:

- `dismissCount`
- `lastSeen`
- `status`

This makes the package suitable for GDPR-conscious applications where minimal local state persistence is preferred.

## Recommended Usage

- Render the widget once at app level to avoid duplicate instances
- Keep `onSend` asynchronous and return a real promise
- Connect `onSend` to your own API endpoint or backend handler
- Use translations to align the widget with your product language
- Adjust the backoff schedule to match your UX policy

## License

MIT © LibDev
