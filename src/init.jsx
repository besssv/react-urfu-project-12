import { StrictMode } from 'react'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import App from './App.jsx'

const init = async (socket) => (
  <StrictMode>
    <MantineProvider>
      <App socket={socket} />
    </MantineProvider>
  </StrictMode>
)

export default init
