import { create } from 'zustand'

export const DEFAULT_CHANNEL_ID = '1'

const useUiStore = create(set => ({
  currentChannelId: DEFAULT_CHANNEL_ID,
  // { type: 'addChannel' | 'renameChannel' | 'removeChannel', channelId? } | null
  modal: null,
  setCurrentChannel: channelId => set({ currentChannelId: channelId }),
  openModal: (type, channelId = null) => set({ modal: { type, channelId } }),
  closeModal: () => set({ modal: null }),
}))

export default useUiStore
