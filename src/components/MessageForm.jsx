import { useEffect, useRef } from 'react'
import { ActionIcon, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useSendMessage } from '../queries.js'
import { useTranslation } from 'react-i18next'

const MessageForm = ({ channelId }) => {
  const inputRef = useRef(null)
  const sendMessage = useSendMessage()
  const { t } = useTranslation()

  // Controlled: при reset() поле не пересоздаётся и фокус остаётся в нём
  const form = useForm({
    mode: 'controlled',
    initialValues: { body: '' },
    transformValues: ({ body }) => ({ body: body.trim() }),
  })

  // Фокус в поле ввода при открытии канала
  useEffect(() => {
    inputRef.current?.focus()
  }, [channelId])

  const handleSubmit = ({ body }) => {
    if (!body) return
    sendMessage.mutate({ body, channelId }, {
      // Во время отправки поле только readOnly, а не disabled, поэтому фокус из него не уходит
      onSuccess: () => form.reset(),
      onError: () => {
        form.setFieldError('body', t('messageForm.sendError'))
      },
    })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Group gap="xs" wrap="nowrap" align="flex-start" p="md">
        <TextInput
          ref={inputRef}
          flex={1}
          placeholder={t('messageForm.placeholder')}
          aria-label={t('messageForm.label')}
          autoComplete="off"
          readOnly={sendMessage.isPending}
          {...form.getInputProps('body')}
        />
        <ActionIcon
          type="submit"
          size="lg"
          aria-label={t('messageForm.submit')}
          loading={sendMessage.isPending}
        >
          ➤
        </ActionIcon>
      </Group>
    </form>
  )
}

export default MessageForm
