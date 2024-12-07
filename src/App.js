import React, { useEffect } from 'react';
import { Box, Heading, Text, VStack, Container, ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import ChatBubble from './components/ChatBubble';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});



function App() {
  useEffect(() => {
    // Create and add the script element
    const script = document.createElement('script');
    script.src = 'https://kornfleyks.github.io/AI-Chatbot/widget.js';
    script.setAttribute('auto-init', 'true');
    document.body.appendChild(script);

    // Cleanup function to remove the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={10}>
          <VStack spacing={6} align="center">
            <Heading size="2xl" color="blue.600">Welcome to Our Demo</Heading>
            <Text fontSize="xl" textAlign="center" color="gray.600">
              This is a demonstration of our AI chatbot assistant. The chat widget will appear in the bottom right corner!
            </Text>
          </VStack>
        </Container>
        {/* <ChatBubble /> */}
      </Box>
    </ChakraProvider>
  );
}

export default App;
