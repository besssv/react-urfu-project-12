import { NavLink, ScrollArea, Stack, Text } from '@mantine/core'
import useUiStore from '../store/uiStore.js'

const ChannelsList = ({ channels, currentChannelId }) => {
  const setCurrentChannel = useUiStore(state => state.setCurrentChannel)

  return (
    <Stack gap="xs" h="100%">
      <Text fw={700} px="sm">Каналы</Text>
      <ScrollArea flex={1}>
        <nav aria-label="Каналы">
          {channels.map(channel => (
            <NavLink
              key={channel.id}
              component="button"
              type="button"
              label={`# ${channel.name}`}
              active={channel.id === currentChannelId}
              aria-current={channel.id === currentChannelId ? 'true' : undefined}
              variant="filled"
              onClick={() => setCurrentChannel(channel.id)}
            />
          ))}
        </nav>
      </ScrollArea>
    </Stack>
  )
}

export default ChannelsList
