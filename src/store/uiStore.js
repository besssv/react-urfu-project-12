import { create } from 'zustand'

export const DEFAULT_CHANNEL_ID = '1'

const useUiStore = create(set => ({
  currentChannelId: DEFAULT_CHANNEL_ID,
  // { type: 'addChannel' | 'renameChannel' | 'removeChannel', channelId } | null
  modal: null,
  setCurrentChannel: channelId => set({ currentChannelId: channelId }),
  // Канал удалён — если пользователь был в нём, возвращаем его в канал по умолчанию
  leaveChannel: channelId => set(state => (
    state.currentChannelId === channelId ? { currentChannelId: DEFAULT_CHANNEL_ID } : {}
  )),
  openModal: (type, channelId = null) => set({ modal: { type, channelId } }),
  closeModal: () => set({ modal: null }),
}))

export default useUiStore
