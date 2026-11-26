import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from './locales/ru.js'

// Свой экземпляр на каждый запуск приложения: init может вызываться несколько раз (например, в тестах)
const createI18n = async () => {
  const i18n = i18next.createInstance()
  await i18n
    .use(initReactI18next)
    .init({
      resources: { ru },
      // Язык задан явно, автоопределение не используется
      lng: 'ru',
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false, // React сам экранирует вывод
      },
    })
  return i18n
}

export default createI18n
