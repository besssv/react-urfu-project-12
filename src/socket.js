import {
  addChannelToCache,
  addMessageToCache,
  queryKeys,
  removeChannelFromCache,
  renameChannelInCache,
} from './queries.js'
import useConnectionStore from './store/connectionStore.js'

const subscribeToSocket = (socket, queryClient) => {
  const { setConnected } = useConnectionStore.getState()
  let wasDisconnected = false

  socket.on('newMessage', message => addMessageToCache(queryClient, message))
  socket.on('newChannel', channel => addChannelToCache(queryClient, channel))
  socket.on('renameChannel', channel => renameChannelInCache(queryClient, channel))
  socket.on('removeChannel', data => removeChannelFromCache(queryClient, data))

  socket.on('connect', () => {
    setConnected(true)
    // Пока соединения не было, изменения могли пройти мимо нас — перезапрашиваем данные
    if (wasDisconnected) {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages })
      queryClient.invalidateQueries({ queryKey: queryKeys.channels })
    }
    wasDisconnected = false
  })

  const handleConnectionLoss = () => {
    wasDisconnected = true
    setConnected(false)
  }

  socket.on('disconnect', handleConnectionLoss)
  socket.on('connect_error', handleConnectionLoss)
}

export default subscribeToSocket
