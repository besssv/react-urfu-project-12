import * as Sentry from '@sentry/react'

// DSN берётся из окружения (12 factors: конфигурация отдельно от кода).
// Vite подставляет переменные с префиксом VITE_ на этапе сборки.
const dsn = import.meta.env.VITE_SENTRY_DSN

// Без DSN (локальная разработка, автотесты) Sentry не включается и никуда ничего не отправляет
export const initSentry = () => {
  if (!dsn) return
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // Личные данные пользователей (IP, cookies) не отправляем
    sendDefaultPii: false,
  })
}

// Ошибки сервера (5xx) — это баг, о котором нужно узнать. Сетевые сбои и 4xx — штатные ситуации
export const reportServerError = (error) => {
  if (error?.status >= 500) {
    Sentry.captureException(error)
  }
}

// Обработчики для createRoot (React 19): ошибки, которые не поймал ни один ErrorBoundary
export const rootErrorHandlers = () => ({
  onUncaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
})
