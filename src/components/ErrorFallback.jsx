import {
  Button,
  Center,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useTranslation } from 'react-i18next'

// Экран вместо упавшего интерфейса: пользователь видит понятное сообщение, а не белую страницу
const ErrorFallback = () => {
  const { t } = useTranslation()

  return (
    <Center h="100dvh" p="md">
      <Stack align="center" gap="sm">
        <Title order={2}>{t('errorBoundary.title')}</Title>
        <Text c="dimmed" ta="center">{t('errorBoundary.text')}</Text>
        <Button onClick={() => window.location.reload()}>{t('errorBoundary.reload')}</Button>
      </Stack>
    </Center>
  )
}

export default ErrorFallback
