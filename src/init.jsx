import { StrictMode } from 'react'
import App from './App.jsx'

const init = async (socket) => (
  <StrictMode>
    <App socket={socket} />
  </StrictMode>
)

export default init
