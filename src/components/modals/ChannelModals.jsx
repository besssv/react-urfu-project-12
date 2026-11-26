import { Modal } from '@mantine/core'
import { useIsMutating } from '@tanstack/react-query'
import useUiStore from '../../store/uiStore.js'
import AddChannelModal from './AddChannelModal.jsx'
import RenameChannelModal from './RenameChannelModal.jsx'
import RemoveChannelModal from './RemoveChannelModal.jsx'
import { useTranslation } from 'react-i18next'

const modals = {
  addChannel: { titleKey: 'modals.add.title', Component: AddChannelModal },
  renameChannel: { titleKey: 'modals.rename.title', Component: RenameChannelModal },
  removeChannel: { titleKey: 'modals.remove.title', Component: RemoveChannelModal },
}

// Какая модалка открыта — состояние интерфейса, оно живёт в Zustand
const ChannelModals = () => {
  const modal = useUiStore(state => state.modal)
  const closeModal = useUiStore(state => state.closeModal)
  const { t } = useTranslation()
  // Пока идёт запрос, модалку не закрываем — иначе пользователь не узнает, чем он закончился
  const busy = useIsMutating() > 0
  const current = modal && modals[modal.type]

  return (
    <Modal
      opened={Boolean(current)}
      onClose={() => !busy && closeModal()}
      title={current && t(current.titleKey)}
      centered
      closeButtonProps={{ 'aria-label': t('modals.close'), disabled: busy }}
    >
      {current && <current.Component channelId={modal.channelId} onClose={closeModal} />}
    </Modal>
  )
}

export default ChannelModals
