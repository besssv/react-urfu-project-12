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
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import App from './App.jsx'
import useAuthStore from './store/authStore.js'
import subscribeToSocket from './socket.js'
import createI18n from './i18n.js'
import { isNetworkError, toastLoadError, toastNetworkError } from './toasts.js'

// Эти ответы сервера разбираются прямо в формах (неверный пароль, занятое имя), отдельный тост не нужен
const handledInForms = [401, 409]

const init = async (socket) => {
  const i18n = await createI18n()

  const logOutIfUnauthorized = (error) => {
    // Токен больше не принимается сервером (например, сервер перезапустился) — выходим
    if (error.status === 401 && useAuthStore.getState().token) {
      useAuthStore.getState().logOut()
    }
  }

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        logOutIfUnauthorized(error)
        if (error.status !== 401) {
          toastLoadError(i18n.t(isNetworkError(error) ? 'toasts.networkError' : 'toasts.loadError'))
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        logOutIfUnauthorized(error)
        if (!handledInForms.includes(error.status)) {
          toastNetworkError(i18n.t('toasts.networkError'))
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => error.status !== 401 && failureCount < 2,
      },
    },
  })

  subscribeToSocket(socket, queryClient, i18n)

  // После выхода серверные данные прошлого пользователя не должны оставаться в кеше
  useAuthStore.subscribe((state, prevState) => {
    if (prevState.token && !state.token) {
      queryClient.clear()
    }
  })

  return (
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider>
            {/* По центру сверху: справа уведомление закрывало бы кнопку «Выйти» в хедере */}
            <Notifications position="top-center" />
            <App socket={socket} />
          </MantineProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </StrictMode>
  )
}

export default init
