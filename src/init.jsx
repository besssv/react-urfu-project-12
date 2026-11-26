import { StrictMode } from 'react'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { ErrorBoundary } from '@sentry/react'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import App from './App.jsx'
import { AppContext } from './AppContext.js'
import { createAuthStore } from './store/authStore.js'
import { createUiStore } from './store/uiStore.js'
import subscribeToSocket from './socket.js'
import createI18n from './i18n.js'
import { createToasts, isNetworkError } from './toasts.js'
import { reportServerError } from './sentry.js'
import ErrorFallback from './components/ErrorFallback.jsx'

// Эти ответы сервера разбираются прямо в формах (неверный пароль, занятое имя), отдельный тост не нужен
const handledInForms = [401, 409]

const init = async (socket) => {
  // Всё, что хранит состояние, создаётся здесь — на каждый запуск заново, а не на уровне модуля
  const i18n = await createI18n()
  const authStore = createAuthStore()
  const uiStore = createUiStore()
  const toasts = createToasts()

  const logOutIfUnauthorized = (error) => {
    // Токен больше не принимается сервером (например, сервер перезапустился) — выходим
    if (error.status === 401 && authStore.getState().token) {
      authStore.getState().logOut()
    }
  }

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        logOutIfUnauthorized(error)
        reportServerError(error)
        if (error.status !== 401) {
          toasts.loadError(i18n.t(isNetworkError(error) ? 'toasts.networkError' : 'toasts.loadError'))
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        logOutIfUnauthorized(error)
        reportServerError(error)
        if (!handledInForms.includes(error.status)) {
          toasts.networkError(i18n.t('toasts.networkError'))
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => error.status !== 401 && failureCount < 2,
      },
    },
  })

  subscribeToSocket(socket, { queryClient, uiStore, toasts, i18n })

  // После выхода серверные данные прошлого пользователя не должны оставаться в кеше
  authStore.subscribe((state, prevState) => {
    if (prevState.token && !state.token) {
      queryClient.clear()
    }
  })

  const appContext = { authStore, uiStore, toasts }

  return (
    <StrictMode>
      <AppContext.Provider value={appContext}>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <MantineProvider>
              {/* По центру сверху: справа уведомление закрывало бы кнопку «Выйти» в хедере */}
              <Notifications position="top-center" store={toasts.store} />
              {/* Ошибка в любом компоненте: показываем запасной экран и отправляем отчёт в Sentry */}
              <ErrorBoundary fallback={<ErrorFallback />}>
                <App socket={socket} />
              </ErrorBoundary>
            </MantineProvider>
          </QueryClientProvider>
        </I18nextProvider>
      </AppContext.Provider>
    </StrictMode>
  )
}

export default init
