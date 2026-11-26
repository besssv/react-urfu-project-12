import { useChannels, useRenameChannel } from '../../queries.js'
import ChannelNameForm from './ChannelNameForm.jsx'
import { useTranslation } from 'react-i18next'
import { useToasts } from '../../toasts.js'

const RenameChannelModal = ({ channelId, onClose }) => {
  const { data: channels = [] } = useChannels()
  const renameChannel = useRenameChannel()
  const { t } = useTranslation()
  const toasts = useToasts()
  const channel = channels.find(c => c.id === channelId)

  return (
    <ChannelNameForm
      initialName={channel?.name}
      // Сам канал не мешает сохранить его имя без изменений
      takenNames={channels.filter(c => c.id !== channelId).map(c => c.name)}
      pending={renameChannel.isPending}
      submitError={renameChannel.isError ? t('modals.rename.error') : null}
      onCancel={onClose}
      onSubmit={name => renameChannel.mutate({ id: channelId, name }, {
        onSuccess: () => {
          toasts.success(t('toasts.channelRenamed'))
          onClose()
        },
      })}
    />
  )
}

export default RenameChannelModal
