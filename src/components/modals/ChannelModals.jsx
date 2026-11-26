import { Modal } from '@mantine/core'
import { useIsMutating } from '@tanstack/react-query'
import useUiStore from '../../store/uiStore.js'
import AddChannelModal from './AddChannelModal.jsx'
import RenameChannelModal from './RenameChannelModal.jsx'
import RemoveChannelModal from './RemoveChannelModal.jsx'

const modals = {
  addChannel: { title: 'Добавить канал', Component: AddChannelModal },
  renameChannel: { title: 'Переименовать канал', Component: RenameChannelModal },
  removeChannel: { title: 'Удалить канал', Component: RemoveChannelModal },
}

// Какая модалка открыта — состояние интерфейса, оно живёт в Zustand
const ChannelModals = () => {
  const modal = useUiStore(state => state.modal)
  const closeModal = useUiStore(state => state.closeModal)
  // Пока идёт запрос, модалку не закрываем — иначе пользователь не узнает, чем он закончился
  const busy = useIsMutating() > 0
  const current = modal && modals[modal.type]

  return (
    <Modal
      opened={Boolean(current)}
      onClose={() => !busy && closeModal()}
      title={current?.title}
      centered
      closeButtonProps={{ 'aria-label': 'Закрыть', disabled: busy }}
    >
      {current && <current.Component channelId={modal.channelId} onClose={closeModal} />}
    </Modal>
  )
}

export default ChannelModals
