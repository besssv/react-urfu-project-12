import { create } from 'zustand'

// Состояние сокета: пока соединения нет, новые сообщения от других пользователей не приходят
const useConnectionStore = create(set => ({
  connected: true,
  setConnected: connected => set({ connected }),
}))

export default useConnectionStore
