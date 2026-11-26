import { BrowserRouter, Routes, Route } from 'react-router'
import routes from './routes.js'
import ChatPage from './pages/ChatPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path={routes.chat()} element={<ChatPage />} />
      <Route path={routes.login()} element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
)

export default App
