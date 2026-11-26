import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchChannels, fetchMessages, postMessage } from './api.js'
import useAuthStore from './store/authStore.js'

export const queryKeys = {
  channels: ['channels'],
  messages: ['messages'],
}

// Одно и то же сообщение приходит дважды: через сокет и в ответе на POST.
// Если список ещё не загружен, кеш не трогаем — иначе запрос за полным списком не выполнится
const addUnique = item => (items) => {
  if (!items || items.some(({ id }) => id === item.id)) return items
  return [...items, item]
}

export const addMessageToCache = (queryClient, message) => {
  queryClient.setQueryData(queryKeys.messages, addUnique(message))
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

export const useSendMessage = () => {
  const token = useAuthStore(state => state.token)
  const username = useAuthStore(state => state.username)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ body, channelId }) => postMessage(token, { body, channelId, username }),
    onSuccess: message => addMessageToCache(queryClient, message),
    // Без сети не ставим запрос в очередь, а сразу показываем ошибку — текст останется в поле
    networkMode: 'always',
  })
}
