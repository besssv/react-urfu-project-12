import {
  Alert,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Loader,
  Paper,
  Text,
} from '@mantine/core'
import useUiStore from '../store/uiStore.js'
import useConnectionStore from '../store/connectionStore.js'
import { useChannels, useMessages } from '../queries.js'
import ChannelsList from '../components/ChannelsList.jsx'
import Messages from '../components/Messages.jsx'
import MessageForm from '../components/MessageForm.jsx'
import ChannelModals from '../components/modals/ChannelModals.jsx'
import { useTranslation } from 'react-i18next'

const Chat = () => {
  const channelsQuery = useChannels()
  const messagesQuery = useMessages()
  const currentChannelId = useUiStore(state => state.currentChannelId)
  const { t } = useTranslation()

  if (channelsQuery.isPending || messagesQuery.isPending) {
    return (
      <Center flex={1}>
        <Loader aria-label={t('chat.loading')} />
      </Center>
    )
  }

  if (channelsQuery.isError || messagesQuery.isError) {
    const retry = () => {
      channelsQuery.refetch()
      messagesQuery.refetch()
    }
    return (
      <Center flex={1}>
        <Alert color="red" title={t('chat.loadError')}>
          <Button variant="light" color="red" mt="sm" onClick={retry}>{t('chat.retry')}</Button>
        </Alert>
      </Center>
    )
  }

  const channels = channelsQuery.data
  const currentChannel = channels.find(c => c.id === currentChannelId) ?? channels[0]
  const channelMessages = messagesQuery.data.filter(m => m.channelId === currentChannel?.id)

  return (
    <Paper withBorder radius="md" flex={1} mih={0}>
      <Flex h="100%">
        <Box w={{ base: 140, sm: 220 }} py="md" bg="gray.0">
          <ChannelsList channels={channels} currentChannelId={currentChannel?.id} />
        </Box>
        <Divider orientation="vertical" />
        <Flex direction="column" flex={1} miw={0}>
          <Box p="md" bg="gray.0">
            <Text fw={700} truncate="end" title={currentChannel?.name}>{`# ${currentChannel?.name ?? ''}`}</Text>
            <Text size="sm" c="dimmed">{t('chat.messagesCount', { count: channelMessages.length })}</Text>
          </Box>
          <Divider />
          <Messages messages={channelMessages} />
          <Divider />
          <MessageForm channelId={currentChannel?.id} />
        </Flex>
      </Flex>
    </Paper>
  )
}

const ChatPage = () => {
  const connected = useConnectionStore(state => state.connected)
  const { t } = useTranslation()

  return (
    <Flex direction="column" flex={1} mih={0} p="md" gap="md">
      {!connected && (
        <Alert color="yellow" variant="light" role="status">
          {t('chat.disconnected')}
        </Alert>
      )}
      <Chat />
      <ChannelModals />
    </Flex>
  )
}

export default ChatPage
