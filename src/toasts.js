import { notifications } from '@mantine/notifications'

// Постоянные id: повторная ошибка заменяет уже показанное уведомление, а не плодит копии
const ids = {
  connection: 'connection',
  loadError: 'load-error',
  networkError: 'network-error',
}

export const toastSuccess = message => notifications.show({ message, color: 'green' })

export const toastLoadError = message => notifications.show({
  id: ids.loadError, message, color: 'red',
})

export const toastNetworkError = message => notifications.show({
  id: ids.networkError, message, color: 'red',
})

// Пока соединения нет, уведомление висит; при восстановлении превращается в «успех» и исчезает
export const toastDisconnected = (message) => {
  notifications.hide(ids.connection)
  notifications.show({
    id: ids.connection, message, color: 'yellow', autoClose: false, withCloseButton: true,
  })
}

export const toastReconnected = message => notifications.update({
  id: ids.connection, message, color: 'green', autoClose: 3000,
})

// Ошибка без HTTP-статуса — запрос не дошёл до сервера, то есть пропала сеть
export const isNetworkError = error => error?.status === undefined
