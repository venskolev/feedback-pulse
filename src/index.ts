// Зареждаме изолираните Tailwind стилове
import './styles/tailwind.css';

// Експортираме контекста и провайдъра
export { FeedbackProvider, useFeedbackContext } from './context/FeedbackProvider';
export type { FeedbackProviderProps } from './context/FeedbackProvider';

// Експортираме главния визуален уиджет
export { FeedbackWidget } from './components/FeedbackWidget';
export type { FeedbackWidgetProps } from './components/FeedbackWidget';

// Експортираме типовете за пълна TypeScript поддръжка
export * from './types';