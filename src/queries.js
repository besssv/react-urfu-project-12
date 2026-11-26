import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createChannel,
  fetchChannels,
  fetchMessages,
  postMessage,
  removeChannel,
  renameChannel,
} from './api.js'
import useAuthStore from './store/authStore.js'
import useUiStore from './store/uiStore.js'

export const queryKeys = {
  channels: ['channels'],
  messages: ['messages'],
}

// Изменения приходят дважды: через сокет и в ответе на запрос, поэтому все обновления кеша идемпотентны.
// Если список ещё не загружен (items === undefined), кеш не трогаем — иначе запрос за полным списком не выполнится
const addUnique = item => (items) => {
  if (!items || items.some(({ id }) => id === item.id)) return items
  return [...items, item]
}

export const addMessageToCache = (queryClient, message) => {
  queryClient.setQueryData(queryKeys.messages, addUnique(message))
}

export const addChannelToCache = (queryClient, channel) => {
  queryClient.setQueryData(queryKeys.channels, addUnique(channel))
}

export const renameChannelInCache = (queryClient, channel) => {
  queryClient.setQueryData(queryKeys.channels, items => items?.map(c => (c.id === channel.id ? channel : c)))
}

export const removeChannelFromCache = (queryClient, { id }) => {
  queryClient.setQueryData(queryKeys.channels, items => items?.filter(c => c.id !== id))
  queryClient.setQueryData(queryKeys.messages, items => items?.filter(m => m.channelId !== id))
  // Все, кто находился в удалённом канале, переезжают в канал по умолчанию
  useUiStore.getState().leaveChannel(id)
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

// Без сети мутации не ставятся в очередь, а сразу завершаются ошибкой — пользователь видит её и может повторить
const mutationDefaults = { networkMode: 'always' }

export const useSendMessage = () => {
  const token = useAuthStore(state => state.token)
  const username = useAuthStore(state => state.username)
  const queryClient = useQueryClient()
  return useMutation({
    ...mutationDefaults,
    mutationFn: ({ body, channelId }) => postMessage(token, { body, channelId, username }),
    onSuccess: message => addMessageToCache(queryClient, message),
  })
}

export const useAddChannel = () => {
  const token = useAuthStore(state => state.token)
  const queryClient = useQueryClient()
  return useMutation({
    ...mutationDefaults,
    mutationFn: name => createChannel(token, name),
    onSuccess: (channel) => {
      addChannelToCache(queryClient, channel)
      // Создатель канала сразу попадает в него
      useUiStore.getState().setCurrentChannel(channel.id)
    },
  })
}

export const useRenameChannel = () => {
  const token = useAuthStore(state => state.token)
  const queryClient = useQueryClient()
  return useMutation({
    ...mutationDefaults,
    mutationFn: ({ id, name }) => renameChannel(token, id, name),
    onSuccess: channel => renameChannelInCache(queryClient, channel),
  })
}

export const useRemoveChannel = () => {
  const token = useAuthStore(state => state.token)
  const queryClient = useQueryClient()
  return useMutation({
    ...mutationDefaults,
    mutationFn: id => removeChannel(token, id),
    onSuccess: data => removeChannelFromCache(queryClient, data),
  })
}
