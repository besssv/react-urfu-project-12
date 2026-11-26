import { createNotificationsStore, hideNotification, showNotification, updateNotification } from '@mantine/notifications'
import { useAppContext } from './AppContext.js'

// Постоянные id: повторная ошибка заменяет уже показанное уведомление, а не плодит копии
const ids = {
  connection: 'connection',
  loadError: 'load-error',
  networkError: 'network-error',
}

// Своё хранилище уведомлений на каждый запуск: глобальное хранилище Mantine
// донесло бы уведомления одного запуска до следующего
export const createToasts = () => {
  const store = createNotificationsStore()
  const show = notification => showNotification(notification, store)

  return {
    store,
    success: message => show({ message, color: 'green' }),
    loadError: message => show({ id: ids.loadError, message, color: 'red' }),
    networkError: message => show({ id: ids.networkError, message, color: 'red' }),
    // Пока соединения нет, уведомление висит; при восстановлении превращается в «успех» и исчезает
    disconnected: (message) => {
      hideNotification(ids.connection, store)
      show({ id: ids.connection, message, color: 'yellow', autoClose: false, withCloseButton: true })
    },
    reconnected: message => updateNotification({ id: ids.connection, message, color: 'green', autoClose: 3000 }, store),
  }
}

export const useToasts = () => useAppContext().toasts

// Ошибка без HTTP-статуса — запрос не дошёл до сервера, то есть пропала сеть
export const isNetworkError = error => error?.status === undefined
