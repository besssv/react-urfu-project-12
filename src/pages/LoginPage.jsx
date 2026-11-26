import { useState } from 'react'
import {
  Alert,
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router'
import { login } from '../api.js'
import useAuthStore from '../store/authStore.js'
import routes from '../routes.js'

const LoginPage = () => {
  const token = useAuthStore(state => state.token)
  const logIn = useAuthStore(state => state.logIn)
  const navigate = useNavigate()
  const location = useLocation()
  const [submitting, setSubmitting] = useState(false)
  const [networkError, setNetworkError] = useState(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
  })

  const redirectTo = location.state?.from?.pathname ?? routes.chat()

  if (token) {
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    setNetworkError(false)
    try {
      const data = await login(values)
      logIn(data)
      navigate(redirectTo, { replace: true })
    }
    catch (error) {
      if (error.status === 401) {
        form.setErrors({ username: true, password: 'Неверные имя пользователя или пароль' })
      }
      else {
        setNetworkError(true)
      }
      setSubmitting(false)
    }
  }

  return (
    <Container size={420} py="xl" w="100%">
      <Paper withBorder shadow="sm" p="xl" radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Title order={1} ta="center">Войти</Title>
            {networkError && (
              <Alert color="red" variant="light">
                Ошибка соединения. Попробуйте ещё раз.
              </Alert>
            )}
            <TextInput
              label="Ваш ник"
              autoComplete="username"
              required
              autoFocus
              key={form.key('username')}
              {...form.getInputProps('username')}
            />
            <PasswordInput
              label="Пароль"
              autoComplete="current-password"
              required
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <Button type="submit" fullWidth loading={submitting}>Войти</Button>
            <Text size="sm" ta="center">
              Нет аккаунта?
              {' '}
              <Anchor component={Link} to={routes.signup()}>Регистрация</Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default LoginPage
