import React from 'react';
import { Box } from '@chakra-ui/react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const MessageList = ({
  messages,
  formatMessageTime,
  handleCopyMessage,
  handleDeleteMessage,
  setEditingMessage,
  isLoading,
  colorMode,
  messagesEndRef
}) => {
  return (
    <Box
      flex={1}
      overflowY="auto"
      borderWidth={1}
      borderRadius="lg"
      p={4}
      bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
      position="relative"
      w="100%"
      sx={{
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: colorMode === 'light' ? 'gray.100' : 'gray.600',
        },
        '&::-webkit-scrollbar-thumb': {
          background: colorMode === 'light' ? 'gray.300' : 'gray.500',
          borderRadius: '4px',
        },
      }}
    >
      <Box>
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            formatMessageTime={formatMessageTime}
            handleCopyMessage={handleCopyMessage}
            handleDeleteMessage={handleDeleteMessage}
            setEditingMessage={setEditingMessage}
            colorMode={colorMode}
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </Box>
    </Box>
  );
};

export default MessageList;
