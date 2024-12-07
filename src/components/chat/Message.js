import React from 'react';
import { Box, Text, HStack, IconButton, useColorMode, Tooltip } from '@chakra-ui/react';
import { FaRegCopy, FaTrash, FaEdit } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const Message = ({ 
  message, 
  formatMessageTime, 
  handleCopyMessage, 
  handleDeleteMessage, 
  setEditingMessage,
  colorMode
}) => {
  const isUser = message.role === 'user';
  const alignSelf = isUser ? 'flex-end' : 'flex-start';
  const bg = isUser 
    ? (colorMode === 'light' ? 'blue.500' : 'blue.600')
    : (colorMode === 'light' ? 'gray.200' : 'gray.600');
  const color = isUser ? 'white' : (colorMode === 'light' ? 'black' : 'white');

  return (
    <Box
      display="flex"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      mb={4}
      w="100%"
    >
      <Box
        maxW="80%"
        bg={bg}
        color={color}
        p={3}
        borderRadius="lg"
        position="relative"
        mt={6}
        _hover={{ '& > .message-actions': { opacity: 1 } }}
      >
        <Box 
          className="message-actions" 
          opacity={0} 
          transition="opacity 0.2s"
          position="absolute"
          top="-30px"
          right="0"
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          borderRadius="md"
          shadow="md"
          p={1}
        >
          <HStack spacing={1}>
            <Tooltip 
              label="Copy message" 
              placement="top" 
              hasArrow
              openDelay={300}
            >
              <IconButton
                size="xs"
                icon={<FaRegCopy />}
                onClick={() => handleCopyMessage(message.content)}
                aria-label="Copy message"
              />
            </Tooltip>
            {isUser && (
              <>
                <Tooltip 
                  label="Edit message" 
                  placement="top" 
                  hasArrow
                  openDelay={300}
                >
                  <IconButton
                    size="xs"
                    icon={<FaEdit />}
                    onClick={() => setEditingMessage(message)}
                    aria-label="Edit message"
                  />
                </Tooltip>
                <Tooltip 
                  label="Delete message" 
                  placement="top" 
                  hasArrow
                  openDelay={300}
                >
                  <IconButton
                    size="xs"
                    icon={<FaTrash />}
                    onClick={() => handleDeleteMessage(message.id)}
                    aria-label="Delete message"
                  />
                </Tooltip>
              </>
            )}
          </HStack>
        </Box>
        <Box textAlign="left">
          <ReactMarkdown
            components={{
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={docco}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </Box>
        <Text fontSize="xs" color={isUser ? 'whiteAlpha.700' : 'gray.500'} mt={1}>
          {formatMessageTime(message.timestamp)}
          {message.isEdited && ' (edited)'}
        </Text>
      </Box>
    </Box>
  );
};

export default Message;
