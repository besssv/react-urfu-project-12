const ru = {
  translation: {
    appName: 'Hexlet Chat',
    header: {
      logout: 'Выйти',
    },
    login: {
      title: 'Войти',
      username: 'Ваш ник',
      password: 'Пароль',
      submit: 'Войти',
      noAccount: 'Нет аккаунта?',
      signupLink: 'Регистрация',
      errors: {
        invalidCredentials: 'Неверные имя пользователя или пароль',
        network: 'Ошибка соединения. Попробуйте ещё раз.',
      },
    },
    signup: {
      title: 'Регистрация',
      username: 'Имя пользователя',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      submit: 'Зарегистрироваться',
      haveAccount: 'Уже есть аккаунт?',
      loginLink: 'Войти',
      errors: {
        userExists: 'Такой пользователь уже существует',
        network: 'Не удалось зарегистрироваться. Проверьте соединение и попробуйте ещё раз.',
      },
    },
    validation: {
      required: 'Обязательное поле',
      usernameLength: 'От 3 до 20 символов',
      channelNameLength: 'От 3 до 20 символов',
      passwordLength: 'Не менее 6 символов',
      passwordsMustMatch: 'Пароли должны совпадать',
      mustBeUnique: 'Должно быть уникальным',
    },
    notFound: {
      title: 'Страница не найдена',
      hint: 'Но вы можете перейти',
      homeLink: 'на главную страницу',
    },
    chat: {
      loading: 'Загрузка',
      loadError: 'Не удалось загрузить чат',
      retry: 'Повторить',
      disconnected: 'Нет соединения с сервером. Пытаемся переподключиться — новые сообщения появятся, как только связь восстановится.',
      // i18next сам выбирает форму по правилам русского языка: _one, _few, _many
      messagesCount_one: '{{count}} сообщение',
      messagesCount_few: '{{count}} сообщения',
      messagesCount_many: '{{count}} сообщений',
      messagesCount_other: '{{count}} сообщения',
    },
    channels: {
      title: 'Каналы',
      add: 'Добавить канал',
      manage: 'Управление каналом',
      remove: 'Удалить',
      rename: 'Переименовать',
    },
    messageForm: {
      placeholder: 'Введите сообщение...',
      label: 'Новое сообщение',
      submit: 'Отправить',
      sendError: 'Не удалось отправить сообщение. Проверьте соединение и попробуйте ещё раз',
    },
    modals: {
      close: 'Закрыть',
      cancel: 'Отменить',
      submit: 'Отправить',
      channelName: 'Имя канала',
      add: {
        title: 'Добавить канал',
        error: 'Не удалось создать канал. Проверьте соединение и попробуйте ещё раз',
      },
      rename: {
        title: 'Переименовать канал',
        error: 'Не удалось переименовать канал. Проверьте соединение и попробуйте ещё раз',
      },
      remove: {
        title: 'Удалить канал',
        confirm: 'Уверены? Канал будет удалён вместе со всеми сообщениями.',
        submit: 'Удалить',
        error: 'Не удалось удалить канал. Проверьте соединение и попробуйте ещё раз',
      },
    },
  },
}

export default ru
