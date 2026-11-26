import {
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'

const LoginPage = () => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      username: '',
      password: '',
    },
  })

  // Отправка формы на сервер появится на следующем этапе
  const handleSubmit = () => {}

  return (
    <Container size={420} py="xl">
      <Paper withBorder shadow="sm" p="xl" radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Title order={1} ta="center">Войти</Title>
            <TextInput
              label="Ваш ник"
              autoComplete="username"
              required
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
            <Button type="submit" fullWidth>Войти</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default LoginPage
