import React from 'react';
import {
  Flex,
  IconButton,
  useColorMode,
  Input,
  Tooltip,
  Text,
  Box,
} from '@chakra-ui/react';
import {
  FaSearch,
  FaDownload,
  FaMoon,
  FaSun,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';
import ConversationManager from './ConversationManager';

const ChatHeader = ({
  searchTerm,
  setSearchTerm,
  handleExport,
  soundEnabled,
  setSoundEnabled,
  conversations,
  selectedConversation,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onDeleteConversation,
}) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex direction="column" w="100%" gap={2}>
      <Flex justify="space-between" align="center" w="100%">
        <Text fontSize="xl" fontWeight="bold">
          {conversations[selectedConversation]?.name || 'Chat'}
        </Text>
        <Flex gap={2}>
          <ConversationManager
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={onSelectConversation}
            onNewConversation={onNewConversation}
            onRenameConversation={onRenameConversation}
            onDeleteConversation={onDeleteConversation}
          />
          <Tooltip 
            label={soundEnabled ? "Mute sound" : "Enable sound"} 
            placement="top" 
            hasArrow 
            openDelay={300}
          >
            <IconButton
              icon={soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            />
          </Tooltip>
          <Tooltip 
            label={colorMode === 'light' ? "Switch to dark mode" : "Switch to light mode"} 
            placement="top" 
            hasArrow 
            openDelay={300}
          >
            <IconButton
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Flex gap={2}>
        <Input
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          flex={1}
        />
        <Tooltip label="Search" placement="top" hasArrow openDelay={300}>
          <IconButton
            icon={<FaSearch />}
            aria-label="Search"
          />
        </Tooltip>
        <Tooltip label="Export chat" placement="top" hasArrow openDelay={300}>
          <IconButton
            icon={<FaDownload />}
            onClick={handleExport}
            aria-label="Export chat"
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default ChatHeader;
