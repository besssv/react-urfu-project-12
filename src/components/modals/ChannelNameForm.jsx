import { Button, Group, TextInput } from '@mantine/core'
import { hasLength, isNotEmpty, useForm } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import censor from '../../profanity.js'

// Форма имени канала — общая для создания и переименования
const ChannelNameForm = ({
  initialName = '',
  takenNames,
  onSubmit,
  onCancel,
  pending,
  submitError,
}) => {
  const { t } = useTranslation()
  const required = isNotEmpty(t('validation.required'))
  const length = hasLength({ min: 3, max: 20 }, t('validation.channelNameLength'))

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: initialName },
    validate: {
      name: (value) => {
        const name = value.trim()
        return required(name)
          ?? length(name)
          // Сравниваем с тем именем, которое реально сохранится — после фильтрации
          ?? (takenNames.includes(censor(name)) ? t('validation.mustBeUnique') : null)
      },
    },
    transformValues: ({ name }) => ({ name: name.trim() }),
  })

  const inputProps = form.getInputProps('name')

  // При переименовании сразу выделяем старое имя, чтобы его было удобно заменить.
  // Обработчик формы (отметка touched) тоже вызываем — иначе мы бы его перетёрли
  const handleFocus = (event) => {
    inputProps.onFocus?.(event)
    const input = event.currentTarget
    // Откладываем: браузер ставит курсор в поле уже после события focus
    setTimeout(() => input.select())
  }

  return (
    // Обычная форма: Enter в поле ввода отправляет её так же, как кнопка
    <form onSubmit={form.onSubmit(({ name }) => onSubmit(name))} noValidate>
      <TextInput
        label={t('modals.channelName')}
        data-autofocus
        readOnly={pending}
        autoComplete="off"
        key={form.key('name')}
        {...inputProps}
        onFocus={handleFocus}
        error={form.errors.name ?? submitError}
      />
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onCancel} disabled={pending}>{t('modals.cancel')}</Button>
        <Button type="submit" loading={pending}>{t('modals.submit')}</Button>
      </Group>
    </form>
  )
}

export default ChannelNameForm
