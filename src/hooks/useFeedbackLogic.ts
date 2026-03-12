import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { FeedbackSettings, FeedbackCookieState } from '../types';

// Използваме Omit, за да кажем на TypeScript, че тук не ни трябват преводите
const DEFAULT_SETTINGS: Omit<Required<FeedbackSettings>, 'translations'> = {
  triggerDelay: 30000, // 30 секунди за нови потребители
  storageKey: 'ld_fp_state',
  cookieExpiryDays: 90, // Не го питаме 3 месеца, ако е отговорил
  // 86400 сек (24 часа) -> 604800 сек (7 дни) -> 300 сек (5 мин - Агресивен режим)
  backoffSchedule: [86400, 604800, 300], 
  variant: 'emoji',
};

export const useFeedbackLogic = (settings?: FeedbackSettings) => {
  const config = { ...DEFAULT_SETTINGS, ...settings };
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Хелпър за четене на бисквитката
  const getCookieState = useCallback((): FeedbackCookieState | null => {
    const raw = Cookies.get(config.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as FeedbackCookieState;
    } catch {
      return null;
    }
  }, [config.storageKey]);

  // Хелпър за запис в бисквитката
  const setCookieState = useCallback((state: FeedbackCookieState, expiresDays?: number) => {
    Cookies.set(config.storageKey, JSON.stringify(state), {
      expires: expiresDays,
      sameSite: 'strict', // Защита според стандартите
    });
  }, [config.storageKey]);

  // Основният алгоритъм за показване (Aggressive Backoff)
  useEffect(() => {
    const currentState = getCookieState();

    // 1. Изцяло нов потребител
    if (!currentState) {
      const initialTimer = setTimeout(() => {
        setIsVisible(true);
      }, config.triggerDelay);
      
      return () => clearTimeout(initialTimer);
    }

    // 2. Потребителят вече е попълнил анкетата
    if (currentState.status === 'completed') {
      return; 
    }

    // 3. Изчисляване на времето за изчакване спрямо броя откази
    const backoffIndex = Math.min(
      Math.max(0, currentState.dismissCount - 1), 
      config.backoffSchedule.length - 1
    );
    
    const waitTimeMs = config.backoffSchedule[backoffIndex] * 1000;
    const timePassed = Date.now() - currentState.lastSeen;
    const timeRemaining = waitTimeMs - timePassed;

    if (timeRemaining <= 0) {
      // Времето е изтекло, докато не е бил на сайта – показваме веднага
      setIsVisible(true);
    } else {
      // Все още е в период на изчакване – навиваме таймера
      const backoffTimer = setTimeout(() => {
        setIsVisible(true);
      }, timeRemaining);
      
      return () => clearTimeout(backoffTimer);
    }
  }, [
    config.triggerDelay, 
    config.backoffSchedule, 
    getCookieState
  ]);

  // Функция, която се извиква, когато потребителят затвори (Х) прозореца
  const onDismiss = useCallback(() => {
    setIsVisible(false);
    
    const currentState = getCookieState() || { 
      dismissCount: 0, 
      lastSeen: Date.now(), 
      status: 'active' 
    };
    
    const newCount = currentState.dismissCount + 1;
    // Ако е стигнал до последния индекс на масива, превключваме на агресивен режим
    const newStatus = newCount >= config.backoffSchedule.length ? 'aggressive' : 'dismissed';

    setCookieState({
      dismissCount: newCount,
      lastSeen: Date.now(),
      status: newStatus
    }, 365); // Пазим състоянието на отказите дълго време
  }, [config.backoffSchedule.length, getCookieState, setCookieState]);

  // Функция, която се извиква при успешно изпращане на данни
  const onComplete = useCallback(() => {
    setIsVisible(false);
    
    setCookieState({
      dismissCount: 0,
      lastSeen: Date.now(),
      status: 'completed'
    }, config.cookieExpiryDays); // Тук важи настройката за давност на отговора
  }, [config.cookieExpiryDays, setCookieState]);

  return {
    isVisible,
    onDismiss,
    onComplete
  };
};