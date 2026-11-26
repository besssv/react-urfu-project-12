import {
  ActionIcon,
  Group,
  Menu,
  NavLink,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core'
import useUiStore from '../store/uiStore.js'

const ChannelMenu = ({ channel, active }) => {
  const openModal = useUiStore(state => state.openModal)

  return (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <ActionIcon
          variant={active ? 'filled' : 'subtle'}
          color={active ? undefined : 'gray'}
          size="lg"
          aria-label="Управление каналом"
        >
          ⋮
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => openModal('removeChannel', channel.id)}>Удалить</Menu.Item>
        <Menu.Item onClick={() => openModal('renameChannel', channel.id)}>Переименовать</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

const ChannelsList = ({ channels, currentChannelId }) => {
  const setCurrentChannel = useUiStore(state => state.setCurrentChannel)
  const openModal = useUiStore(state => state.openModal)

  return (
    <Stack gap="xs" h="100%">
      <Group justify="space-between" wrap="nowrap" px="sm">
        <Text fw={700}>Каналы</Text>
        <ActionIcon variant="light" aria-label="Добавить канал" onClick={() => openModal('addChannel')}>
          +
        </ActionIcon>
      </Group>
      <ScrollArea flex={1} type="auto">
        <nav aria-label="Каналы">
          {channels.map((channel) => {
            const active = channel.id === currentChannelId
            return (
              <Group key={channel.id} gap={0} wrap="nowrap">
                <NavLink
                  component="button"
                  type="button"
                  // Длинное имя обрезается многоточием, полное видно во всплывающей подсказке
                  label={<Text span inherit truncate="end" display="block">{`# ${channel.name}`}</Text>}
                  title={channel.name}
                  active={active}
                  aria-current={active ? 'true' : undefined}
                  variant="filled"
                  flex={1}
                  miw={0}
                  onClick={() => setCurrentChannel(channel.id)}
                />
                {channel.removable && <ChannelMenu channel={channel} active={active} />}
              </Group>
            )
          })}
        </nav>
      </ScrollArea>
    </Stack>
  )
}

export default ChannelsList
