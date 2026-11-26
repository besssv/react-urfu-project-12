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

const pluralizeMessages = (count) => {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return `${count} сообщение`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} сообщения`
  return `${count} сообщений`
}

const Chat = () => {
  const channelsQuery = useChannels()
  const messagesQuery = useMessages()
  const currentChannelId = useUiStore(state => state.currentChannelId)

  if (channelsQuery.isPending || messagesQuery.isPending) {
    return (
      <Center flex={1}>
        <Loader aria-label="Загрузка" />
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
        <Alert color="red" title="Не удалось загрузить чат">
          <Button variant="light" color="red" mt="sm" onClick={retry}>Повторить</Button>
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
            <Text size="sm" c="dimmed">{pluralizeMessages(channelMessages.length)}</Text>
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

  return (
    <Flex direction="column" flex={1} mih={0} p="md" gap="md">
      {!connected && (
        <Alert color="yellow" variant="light" role="status">
          Нет соединения с сервером. Пытаемся переподключиться — новые сообщения появятся, как только связь восстановится.
        </Alert>
      )}
      <Chat />
      <ChannelModals />
    </Flex>
  )
}

export default ChatPage
