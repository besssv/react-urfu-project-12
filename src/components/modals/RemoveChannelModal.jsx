import { Button, Group, Text } from '@mantine/core'
import { useRemoveChannel } from '../../queries.js'
import { useTranslation } from 'react-i18next'

const RemoveChannelModal = ({ channelId, onClose }) => {
  const removeChannel = useRemoveChannel()
  const { t } = useTranslation()

  const handleSubmit = (event) => {
    event.preventDefault()
    removeChannel.mutate(channelId, { onSuccess: onClose })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Text>{t('modals.remove.confirm')}</Text>
      {removeChannel.isError && (
        <Text c="red" size="sm" mt="xs">
          {t('modals.remove.error')}
        </Text>
      )}
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose} disabled={removeChannel.isPending}>{t('modals.cancel')}</Button>
        {/* Фокус на кнопке подтверждения: Enter сразу удаляет канал */}
        <Button type="submit" color="red" loading={removeChannel.isPending} data-autofocus>
          {t('modals.remove.submit')}
        </Button>
      </Group>
    </form>
  )
}

export default RemoveChannelModal
