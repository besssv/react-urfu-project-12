import { Anchor, Box, Button, Divider, Flex, Group } from '@mantine/core'
import { Link, Outlet } from 'react-router'
import useAuthStore from '../store/authStore.js'
import routes from '../routes.js'
import { useTranslation } from 'react-i18next'

// Общий каркас всех страниц: хедер со ссылкой на главную и, для вошедших, кнопкой выхода
const Layout = () => {
  const token = useAuthStore(state => state.token)
  const logOut = useAuthStore(state => state.logOut)
  const { t } = useTranslation()

  return (
    <Flex direction="column" h="100dvh">
      <Box component="header" px="md" py="sm">
        <Group justify="space-between" wrap="nowrap">
          <Anchor component={Link} to={routes.chat()} fw={700} fz="xl" c="dark" underline="never">
            {t('appName')}
          </Anchor>
          {token && <Button variant="default" onClick={logOut}>{t('header.logout')}</Button>}
        </Group>
      </Box>
      <Divider />
      <Flex component="main" direction="column" flex={1} mih={0}>
        <Outlet />
      </Flex>
    </Flex>
  )
}

export default Layout
