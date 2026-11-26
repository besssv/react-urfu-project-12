import {
  addChannelToCache,
  addMessageToCache,
  queryKeys,
  removeChannelFromCache,
  renameChannelInCache,
} from './queries.js'
import { toastDisconnected, toastReconnected } from './toasts.js'

const subscribeToSocket = (socket, queryClient, i18n) => {
  let disconnected = false

  socket.on('newMessage', message => addMessageToCache(queryClient, message))
  socket.on('newChannel', channel => addChannelToCache(queryClient, channel))
  socket.on('renameChannel', channel => renameChannelInCache(queryClient, channel))
  socket.on('removeChannel', data => removeChannelFromCache(queryClient, data))

  socket.on('connect', () => {
    if (!disconnected) return
    disconnected = false
    toastReconnected(i18n.t('toasts.reconnected'))
    // Пока соединения не было, изменения могли пройти мимо нас — перезапрашиваем данные
    queryClient.invalidateQueries({ queryKey: queryKeys.messages })
    queryClient.invalidateQueries({ queryKey: queryKeys.channels })
  })

  const handleConnectionLoss = () => {
    // Попытки переподключения повторяются — показываем уведомление один раз
    if (disconnected) return
    disconnected = true
    toastDisconnected(i18n.t('toasts.disconnected'))
  }

  socket.on('disconnect', handleConnectionLoss)
  socket.on('connect_error', handleConnectionLoss)
}

export default subscribeToSocket
