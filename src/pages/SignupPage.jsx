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
import { useTranslation } from 'react-i18next'

// Сначала проверяем обязательность, потом остальные правила — показываем первую ошибку
const firstError = (...rules) => (value, values, path) => rules
  .map(rule => rule(value, values, path))
  .find(Boolean) ?? null

const SignupPage = () => {
  const token = useAuthStore(state => state.token)
  const logIn = useAuthStore(state => state.logIn)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: value => firstError(
        isNotEmpty(t('validation.required')),
        hasLength({ min: 3, max: 20 }, t('validation.usernameLength')),
      )(value.trim()),
      password: firstError(
        isNotEmpty(t('validation.required')),
        hasLength({ min: 6 }, t('validation.passwordLength')),
      ),
      confirmPassword: firstError(
        isNotEmpty(t('validation.required')),
        matchesField('password', t('validation.passwordsMustMatch')),
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
        form.setFieldError('username', t('signup.errors.userExists'))
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
            <Title order={1} ta="center">{t('signup.title')}</Title>
            {networkError && (
              <Alert color="red" variant="light">
                {t('signup.errors.network')}
              </Alert>
            )}
            <TextInput
              label={t('signup.username')}
              autoComplete="username"
              withAsterisk
              autoFocus
              readOnly={signupMutation.isPending}
              key={form.key('username')}
              {...form.getInputProps('username')}
            />
            <PasswordInput
              label={t('signup.password')}
              autoComplete="new-password"
              withAsterisk
              readOnly={signupMutation.isPending}
              key={form.key('password')}
              {...form.getInputProps('password')}
            />
            <PasswordInput
              label={t('signup.confirmPassword')}
              autoComplete="new-password"
              withAsterisk
              readOnly={signupMutation.isPending}
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
            />
            <Button type="submit" fullWidth loading={signupMutation.isPending}>
              {t('signup.submit')}
            </Button>
            <Text size="sm" ta="center">
              {t('signup.haveAccount')}
              {' '}
              <Anchor component={Link} to={routes.login()}>{t('signup.loginLink')}</Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default SignupPage
