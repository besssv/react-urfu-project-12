import { useChannels, useRenameChannel } from '../../queries.js'
import ChannelNameForm from './ChannelNameForm.jsx'

const NETWORK_ERROR = 'Не удалось переименовать канал. Проверьте соединение и попробуйте ещё раз'

const RenameChannelModal = ({ channelId, onClose }) => {
  const { data: channels = [] } = useChannels()
  const renameChannel = useRenameChannel()
  const channel = channels.find(c => c.id === channelId)

  return (
    <ChannelNameForm
      initialName={channel?.name}
      // Сам канал не мешает сохранить его имя без изменений
      takenNames={channels.filter(c => c.id !== channelId).map(c => c.name)}
      pending={renameChannel.isPending}
      submitError={renameChannel.isError ? NETWORK_ERROR : null}
      onCancel={onClose}
      onSubmit={name => renameChannel.mutate({ id: channelId, name }, { onSuccess: onClose })}
    />
  )
}

export default RenameChannelModal
