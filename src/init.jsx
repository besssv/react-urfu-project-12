import { StrictMode } from 'react'
import { MantineProvider } from '@mantine/core'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import '@mantine/core/styles.css'
import App from './App.jsx'
import useAuthStore from './store/authStore.js'
import subscribeToSocket from './socket.js'
import createI18n from './i18n.js'

const init = async (socket) => {
  const i18n = await createI18n()

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      // Токен больше не принимается сервером (например, сервер перезапустился) — выходим
      onError: (error) => {
        if (error.status === 401) {
          useAuthStore.getState().logOut()
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => error.status !== 401 && failureCount < 2,
      },
    },
  })

  subscribeToSocket(socket, queryClient)

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
            <App socket={socket} />
          </MantineProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </StrictMode>
  )
}

export default init
