import React from 'react';
import { ChakraProvider, Box, Heading, Text } from '@chakra-ui/react';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <ChakraProvider>
      <Box textAlign="center" py={10}>
        <Heading mb={4}>AI Chatbot</Heading>
        <Text mb={8} color="gray.600">Ask me anything!</Text>
        <ChatBot />
      </Box>
    </ChakraProvider>
  );
}

export default App;
