import { createStore, useStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAppContext } from '../AppContext.js'

// Фабрика: новое хранилище на каждый запуск приложения. Токен переживает перезагрузку страницы через persist
export const createAuthStore = () => createStore(
  persist(
    set => ({
      token: null,
      username: null,
      logIn: ({ token, username }) => set({ token, username }),
      logOut: () => set({ token: null, username: null }),
    }),
    {
      name: 'auth',
      partialize: ({ token, username }) => ({ token, username }),
    },
  ),
)

// Хук с тем же интерфейсом, что у create() из zustand: useAuthStore(state => state.token)
const useAuthStore = selector => useStore(useAppContext().authStore, selector)

export default useAuthStore
