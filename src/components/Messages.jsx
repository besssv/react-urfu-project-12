import { useEffect, useRef } from 'react'
import { Box, ScrollArea, Stack, Text } from '@mantine/core'

const Messages = ({ messages }) => {
  const viewportRef = useRef(null)

  // Держим ленту прокрученной к последнему сообщению
  useEffect(() => {
    const viewport = viewportRef.current
    viewport?.scrollTo({ top: viewport.scrollHeight })
  }, [messages])

  return (
    <ScrollArea flex={1} viewportRef={viewportRef} px="md">
      <Stack gap="xs" py="sm">
        {messages.map(message => (
          <Box key={message.id}>
            <Text span fw={700}>{message.username}</Text>
            {': '}
            <Text span>{message.body}</Text>
          </Box>
        ))}
      </Stack>
    </ScrollArea>
  )
}

export default Messages
