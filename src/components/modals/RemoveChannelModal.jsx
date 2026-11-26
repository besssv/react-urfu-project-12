import { Button, Group, Text } from '@mantine/core'
import { useRemoveChannel } from '../../queries.js'

const RemoveChannelModal = ({ channelId, onClose }) => {
  const removeChannel = useRemoveChannel()

  const handleSubmit = (event) => {
    event.preventDefault()
    removeChannel.mutate(channelId, { onSuccess: onClose })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Text>Уверены? Канал будет удалён вместе со всеми сообщениями.</Text>
      {removeChannel.isError && (
        <Text c="red" size="sm" mt="xs">
          Не удалось удалить канал. Проверьте соединение и попробуйте ещё раз
        </Text>
      )}
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose} disabled={removeChannel.isPending}>Отменить</Button>
        {/* Фокус на кнопке подтверждения: Enter сразу удаляет канал */}
        <Button type="submit" color="red" loading={removeChannel.isPending} data-autofocus>
          Удалить
        </Button>
      </Group>
    </form>
  )
}

export default RemoveChannelModal
