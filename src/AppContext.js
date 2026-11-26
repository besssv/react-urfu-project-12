import { createContext, useContext } from 'react'

// Все хранилища с состоянием создаются в init() и передаются в дерево через этот контекст.
// На уровне модуля состояния нет: каждый запуск приложения начинается с чистого листа
export const AppContext = createContext(null)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('AppContext не найден: компонент должен рендериться внутри init()')
  }
  return context
}
