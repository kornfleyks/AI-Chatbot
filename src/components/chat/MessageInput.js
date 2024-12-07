import React from 'react';
import { Flex, Input, IconButton, Tooltip } from '@chakra-ui/react';
import { FaPaperclip, FaSmile, FaPaperPlane } from 'react-icons/fa';

const MessageInput = ({ 
  input, 
  setInput, 
  handleSend, 
  isLoading, 
  fileInputRef,
  handleFileUpload,
  setShowEmojiPicker 
}) => {
  return (
    <Flex w="100%">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        mr={2}
        disabled={isLoading}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(Array.from(e.target.files))}
        multiple
        accept="image/*,.txt,.pdf,.doc,.docx"
      />
      <Tooltip label="Upload file" placement="top" hasArrow openDelay={300}>
        <IconButton
          icon={<FaPaperclip />}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload file"
          mr={2}
          isDisabled={isLoading}
        />
      </Tooltip>
      <Tooltip label="Add emoji" placement="top" hasArrow openDelay={300}>
        <IconButton
          icon={<FaSmile />}
          onClick={() => setShowEmojiPicker(prev => !prev)}
          aria-label="Add emoji"
          mr={2}
        />
      </Tooltip>
      <Tooltip label="Send message" placement="top" hasArrow openDelay={300}>
        <IconButton
          icon={<FaPaperPlane />}
          onClick={handleSend}
          aria-label="Send message"
          isLoading={isLoading}
          isDisabled={isLoading}
          colorScheme="blue"
        />
      </Tooltip>
    </Flex>
  );
};

export default MessageInput;
