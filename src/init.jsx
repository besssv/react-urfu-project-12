import { StrictMode } from 'react'
import { MantineProvider } from '@mantine/core'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@mantine/core/styles.css'
import App from './App.jsx'
import useAuthStore from './store/authStore.js'
import subscribeToSocket from './socket.js'

const init = async (socket) => {
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
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <App socket={socket} />
        </MantineProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}

export default init
