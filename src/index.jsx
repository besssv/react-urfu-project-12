import { createRoot } from 'react-dom/client'
import { io } from 'socket.io-client'
import init from './init.jsx'
import { initSentry, rootErrorHandlers } from './sentry.js'

const run = async () => {
  // Коллектор ошибок — внешний ресурс, как и сокет: подключает его точка входа, а не init
  initSentry()
  const socket = io()
  const vdom = await init(socket)
  createRoot(document.getElementById('root'), rootErrorHandlers()).render(vdom)
}

run()
