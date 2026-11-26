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
import {
  hasLength,
  isNotEmpty,
  matchesField,
  useForm,
} from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
import { Link, Navigate, useNavigate } from 'react-router'
import { signup } from '../api.js'
import useAuthStore from '../store/authStore.js'
import routes from '../routes.js'

// Сначала проверяем обязательность, потом остальные правила — показываем первую ошибку
const firstError = (...rules) => (value, values, path) => rules
  .map(rule => rule(value, values, path))
  .find(Boolean) ?? null

const SignupPage = () => {
  const token = useAuthStore(state => state.token)
  const logIn = useAuthStore(state => state.logIn)
  const navigate = useNavigate()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: value => firstError(
        isNotEmpty('Обязательное поле'),
        hasLength({ min: 3, max: 20 }, 'От 3 до 20 символов'),
      )(value.trim()),
      password: firstError(
        isNotEmpty('Обязательное поле'),
        hasLength({ min: 6 }, 'Не менее 6 символов'),
      ),
      confirmPassword: firstError(
        isNotEmpty('Обязательное поле'),
        matchesField('password', 'Пароли должны совпадать'),
      ),
    },
    // Пока пользователь исправляет пароль, сверяем подтверждение заново
    validateInputOnChange: ['confirmPassword'],
    transformValues: ({ username, password }) => ({ username: username.trim(), password }),
  })

  const signupMutation = useMutation({
    mutationFn: signup,
    networkMode: 'always',
    onSuccess: (data) => {
      logIn(data)
      navigate(routes.chat(), { replace: true })
    },
    onError: (error) => {
      if (error.status === 409) {
        form.setFieldError('username', 'Такой пользователь уже существует')
      }
    },
  })

  if (token) {
    return <Navigate to={routes.chat()} replace />
  }

  const networkError = signupMutation.isError && signupMutation.error.status !== 409

  return (
    <Container size={420} py="xl" w="100%">
      <Paper withBorder shadow="sm" p="xl" radius="md">
        <form onSubmit={form.onSubmit(values => signupMutation.mutate(values))} noValidate>
          <Stack>
            <Title order={1} ta="center">Регистрация</Title>
            {networkError && (
              <Alert color="red" variant="light">
                Не удалось зарегистрироваться. Проверьте соединение и попробуйте ещё раз.
              </Alert>
            )}
            <TextInput
              label="Имя пользователя"
              autoComplete="username"
              withAsterisk
              autoFocus
              readOnly={signupMutation.isPending}
              key={form.key('username')}
              {...form.getInputProps('username')}
            />
            <PasswordInput
              label="Пароль"
              autoComplete="new-password"
              withAsterisk
              readOnly={signupMutation.isPending}
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <PasswordInput
              label="Подтвердите пароль"
              autoComplete="new-password"
              withAsterisk
              readOnly={signupMutation.isPending}
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
            />
            <Button type="submit" fullWidth loading={signupMutation.isPending}>
              Зарегистрироваться
            </Button>
            <Text size="sm" ta="center">
              Уже есть аккаунт?
              {' '}
              <Anchor component={Link} to={routes.login()}>Войти</Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default SignupPage
