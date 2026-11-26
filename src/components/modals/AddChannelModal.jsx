import { useAddChannel, useChannels } from '../../queries.js'
import ChannelNameForm from './ChannelNameForm.jsx'
import { useTranslation } from 'react-i18next'
import { useToasts } from '../../toasts.js'

const AddChannelModal = ({ onClose }) => {
  const { data: channels = [] } = useChannels()
  const addChannel = useAddChannel()
  const { t } = useTranslation()
  const toasts = useToasts()

  return (
    <ChannelNameForm
      takenNames={channels.map(c => c.name)}
      pending={addChannel.isPending}
      submitError={addChannel.isError ? t('modals.add.error') : null}
      onCancel={onClose}
      onSubmit={name => addChannel.mutate(name, {
        onSuccess: () => {
          toasts.success(t('toasts.channelCreated'))
          onClose()
        },
      })}
    />
  )
}

export default AddChannelModal
