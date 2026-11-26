import { useQuery } from '@tanstack/react-query'
import { fetchChannels, fetchMessages } from './api.js'
import useAuthStore from './store/authStore.js'

export const queryKeys = {
  channels: ['channels'],
  messages: ['messages'],
}

export const useChannels = () => {
  const token = useAuthStore(state => state.token)
  return useQuery({
    queryKey: queryKeys.channels,
    queryFn: () => fetchChannels(token),
  })
}

export const useMessages = () => {
  const token = useAuthStore(state => state.token)
  return useQuery({
    queryKey: queryKeys.messages,
    queryFn: () => fetchMessages(token),
  })
}
