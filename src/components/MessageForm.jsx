import { ActionIcon, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

const MessageForm = () => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { body: '' },
  })

  // Отправка сообщений появится на следующем этапе
  const handleSubmit = () => {}

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group gap="xs" wrap="nowrap" p="md">
        <TextInput
          flex={1}
          placeholder="Введите сообщение..."
          aria-label="Новое сообщение"
          autoComplete="off"
          key={form.key('body')}
          {...form.getInputProps('body')}
        />
        <ActionIcon type="submit" size="lg" aria-label="Отправить">
          ➤
        </ActionIcon>
      </Group>
    </form>
  )
}

export default MessageForm
