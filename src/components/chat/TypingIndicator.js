import React from 'react';
import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
`;

const TypingIndicator = () => {
  const animation = `${bounce} 1s infinite`;

  return (
    <Box
      display="flex"
      alignItems="center"
      alignSelf="flex-start"
      bg="gray.200"
      p={3}
      borderRadius="lg"
      maxW="100px"
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          w="8px"
          h="8px"
          bg="gray.500"
          borderRadius="full"
          mx="2px"
          animation={animation}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </Box>
  );
};

export default TypingIndicator;
