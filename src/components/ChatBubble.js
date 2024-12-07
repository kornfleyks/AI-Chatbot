import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  IconButton,
  SlideFade,
  VStack,
  Input,
  Flex,
  Text,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  useColorModeValue,
  ChakraProvider,
} from '@chakra-ui/react';
import { FaComments, FaPaperPlane, FaTimes, FaEllipsisV, FaSun, FaMoon, FaPaperclip } from 'react-icons/fa';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const { colorMode, toggleColorMode } = useColorMode();
  
  const bg = useColorModeValue('white', 'gray.800');
  const text = useColorModeValue('gray.800', 'white');
  const border = useColorModeValue('gray.200', 'gray.600');
  const messageBg = useColorModeValue('gray.100', 'gray.700');
  const iconColor = useColorModeValue('gray.600', 'white');
  const inputBg = useColorModeValue('white', 'whiteAlpha.100');
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('https://www.chatbase.co/api/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_CHATBASE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(msg => ({
            content: msg.content,
            role: msg.role,
          })),
          chatbotId: process.env.REACT_APP_CHATBOT_ID,
          stream: false,
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages, toast]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      setInput(prev => `${prev} [File: ${file.name}]`);
      toast({
        title: 'File Attached',
        description: `Selected file: ${file.name}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <ChakraProvider>
      <Box position="fixed" bottom="20px" right="20px" zIndex={1000}>
        <SlideFade in={isOpen} offsetY="20px">
          <Box
            display={isOpen ? 'flex' : 'none'}
            position="fixed"
            bottom="80px"
            right="20px"
            width="350px"
            height="500px"
            bg={bg}
            boxShadow="xl"
            borderRadius="lg"
            overflow="hidden"
            flexDirection="column"
          >
            {/* Header */}
            <Flex
              px={3}
              py={2}
              borderBottom="1px"
              borderColor={border}
              justify="space-between"
              align="center"
              bg={bg}
            >
              <Text fontWeight="bold" color={text}>
                Chat Assistant
              </Text>
              <Flex gap={2}>
                <IconButton
                  icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                  variant="ghost"
                  size="sm"
                  onClick={toggleColorMode}
                  aria-label="Toggle theme"
                  color={iconColor}
                />
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FaEllipsisV />}
                    variant="ghost"
                    size="sm"
                    aria-label="Menu"
                    color={iconColor}
                  />
                  <MenuList bg={bg}>
                    <MenuItem icon={<FaComments />} onClick={() => window.open('https://chatbase.co', '_blank')}>
                      Visit Chatbase
                    </MenuItem>
                    <MenuItem icon={<FaPaperclip />} onClick={() => fileInputRef.current.click()}>
                      Attach File
                    </MenuItem>
                    <MenuItem icon={colorMode === 'light' ? <FaMoon /> : <FaSun />} onClick={toggleColorMode}>
                      Toggle Theme
                    </MenuItem>
                    <MenuItem icon={<FaTimes />} onClick={() => {
                      setIsOpen(false);
                      setMessages([]);
                    }}>
                      Clear Chat
                    </MenuItem>
                  </MenuList>
                </Menu>
                <IconButton
                  icon={<FaTimes />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  color={iconColor}
                />
              </Flex>
            </Flex>

            {/* Messages */}
            <VStack
              flex={1}
              overflowY="auto"
              p={3}
              spacing={2}
              align="stretch"
              bg={bg}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
                  bg={message.role === 'user' ? 'blue.500' : messageBg}
                  color={message.role === 'user' ? 'white' : text}
                  px={4}
                  py={2}
                  borderRadius="lg"
                  maxW="80%"
                  my={1}
                >
                  <Text>{message.content}</Text>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </VStack>

            {/* Input */}
            <Flex
              px={3}
              py={2}
              borderTop="1px"
              borderColor={border}
              bg={bg}
              align="center"
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                mr={2}
                disabled={isTyping}
                bg={inputBg}
                color={text}
                _placeholder={{ color: 'gray.500' }}
                borderColor={border}
                flex={1}
              />
              <IconButton
                icon={<FaPaperclip />}
                variant="ghost"
                size="sm"
                onClick={handleFileClick}
                mr={2}
                color={iconColor}
                aria-label="Attach file"
              />
              <IconButton
                icon={<FaPaperPlane />}
                onClick={handleSendMessage}
                isLoading={isTyping}
                color={iconColor}
                variant="ghost"
              />
            </Flex>
          </Box>
        </SlideFade>

        <IconButton
          icon={<FaComments />}
          isRound
          size="lg"
          colorScheme="blue"
          onClick={() => setIsOpen(!isOpen)}
          boxShadow="lg"
          _hover={{
            transform: 'scale(1.1)',
          }}
          transition="all 0.2s"
        />
      </Box>
    </ChakraProvider>
  );
};

export default ChatBubble;
