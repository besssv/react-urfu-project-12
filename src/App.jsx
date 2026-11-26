import { BrowserRouter, Routes, Route } from 'react-router'
import routes from './routes.js'
import Layout from './components/Layout.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import ChatPage from './pages/ChatPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route
          path={routes.chat()}
          element={(
            <RequireAuth>
              <ChatPage />
            </RequireAuth>
          )}
        />
        <Route path={routes.login()} element={<LoginPage />} />
        <Route path={routes.signup()} element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default App
