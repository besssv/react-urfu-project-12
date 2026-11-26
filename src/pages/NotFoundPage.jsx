import { Anchor, Container, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import routes from '../routes.js'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <Container py="xl">
      <Stack align="center">
        <Title order={1}>{t('notFound.title')}</Title>
        <Text c="dimmed">
          {t('notFound.hint')}
          {' '}
          <Anchor component={Link} to={routes.chat()}>{t('notFound.homeLink')}</Anchor>
        </Text>
      </Stack>
    </Container>
  )
}

export default NotFoundPage
