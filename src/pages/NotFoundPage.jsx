import { Anchor, Container, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router'
import routes from '../routes.js'

const NotFoundPage = () => (
  <Container py="xl">
    <Stack align="center">
      <Title order={1}>Страница не найдена</Title>
      <Text c="dimmed">
        Но вы можете перейти
        {' '}
        <Anchor component={Link} to={routes.chat()}>на главную страницу</Anchor>
      </Text>
    </Stack>
  </Container>
)

export default NotFoundPage
