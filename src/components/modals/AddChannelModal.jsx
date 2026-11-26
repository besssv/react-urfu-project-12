import { useAddChannel, useChannels } from '../../queries.js'
import ChannelNameForm from './ChannelNameForm.jsx'

const NETWORK_ERROR = 'Не удалось создать канал. Проверьте соединение и попробуйте ещё раз'

const AddChannelModal = ({ onClose }) => {
  const { data: channels = [] } = useChannels()
  const addChannel = useAddChannel()

  return (
    <ChannelNameForm
      takenNames={channels.map(c => c.name)}
      pending={addChannel.isPending}
      submitError={addChannel.isError ? NETWORK_ERROR : null}
      onCancel={onClose}
      onSubmit={name => addChannel.mutate(name, { onSuccess: onClose })}
    />
  )
}

export default AddChannelModal
