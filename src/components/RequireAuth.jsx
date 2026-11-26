import { Navigate, useLocation } from 'react-router'
import useAuthStore from '../store/authStore.js'
import routes from '../routes.js'

const RequireAuth = ({ children }) => {
  const token = useAuthStore(state => state.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to={routes.login()} state={{ from: location }} replace />
  }

  return children
}

export default RequireAuth
