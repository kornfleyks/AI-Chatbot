import React, { useState, useMemo, useRef } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Tooltip,
  InputGroup,
  InputLeftElement,
  Divider,
  Badge,
  Checkbox,
  Tag,
  TagLabel,
  TagCloseButton,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Box,
} from '@chakra-ui/react';
import { 
  FaEllipsisV, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaThumbtack,
  FaArchive,
  FaTag,
  FaShare,
  FaFileImport,
  FaFileExport,
} from 'react-icons/fa';

const ConversationManager = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onDeleteConversation,
  onImportConversation,
  onPinConversation,
  onArchiveConversation,
  onAddTag,
  onRemoveTag,
  onBulkExport,
  onBulkDelete,
  onShareConversation,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newConvName, setNewConvName] = useState('');
  const [editingConv, setEditingConv] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [newTag, setNewTag] = useState('');
  const [selectedConversations, setSelectedConversations] = useState(new Set());
  const [showArchived, setShowArchived] = useState(false);
  const fileInputRef = useRef();
  
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const filteredConversations = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return Object.entries(conversations)
      .filter(([_, conv]) => {
        const matchesSearch = conv.name.toLowerCase().includes(query) ||
          conv.tags.some(tag => tag.toLowerCase().includes(query));
        const matchesArchived = showArchived ? conv.archived : !conv.archived;
        return matchesSearch && matchesArchived;
      })
      .sort((a, b) => {
        // Sort pinned conversations first
        if (a[1].pinned && !b[1].pinned) return -1;
        if (!a[1].pinned && b[1].pinned) return 1;
        
        // Then sort by most recent message
        const aLastMessage = a[1].messages[a[1].messages.length - 1]?.timestamp || '';
        const bLastMessage = b[1].messages[b[1].messages.length - 1]?.timestamp || '';
        return bLastMessage.localeCompare(aLastMessage);
      });
  }, [conversations, searchQuery, showArchived]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportConversation(file);
    }
    event.target.value = '';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString();
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString(undefined, { weekday: 'short' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatDuration = (ms) => {
    if (!ms) return '0s';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const getConversationPreview = (messages) => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return 'No messages';
    return lastMessage.content.length > 30 
      ? `${lastMessage.content.substring(0, 30)}...` 
      : lastMessage.content;
  };

  const getLastMessageTime = (messages) => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return '';
    const date = new Date(lastMessage.timestamp);
    return date.toLocaleString();
  };

  const handleCreateConversation = () => {
    if (newConvName.trim()) {
      onNewConversation(newConvName.trim());
      setNewConvName('');
      onClose();
    }
  };

  const handleRenameConversation = () => {
    if (newConvName.trim() && editingConv) {
      onRenameConversation(editingConv, newConvName.trim());
      setNewConvName('');
      setEditingConv(null);
      onClose();
    }
  };

  return (
    <>
      <Menu>
        <Tooltip label="Manage conversations" placement="top" hasArrow openDelay={300}>
          <MenuButton
            as={IconButton}
            icon={<FaEllipsisV />}
            variant="ghost"
            aria-label="Manage conversations"
          />
        </Tooltip>
        <MenuList maxH="600px" w="400px" overflowY="auto">
          <VStack p={2} spacing={2}>
            <Tabs w="100%" onChange={setSelectedTab} index={selectedTab}>
              <TabList>
                <Tab>Active</Tab>
                <Tab>Archived</Tab>
                <Tab>Stats</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={2}>
                  <VStack spacing={2} align="stretch">
                    <InputGroup size="sm">
                      <InputLeftElement pointerEvents="none">
                        <FaSearch color="gray.300" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </InputGroup>
                    <HStack>
                      <Button
                        leftIcon={<FaPlus />}
                        size="sm"
                        onClick={() => {
                          setNewConvName('');
                          setEditingConv(null);
                          onOpen();
                        }}
                      >
                        New
                      </Button>
                      <Button
                        leftIcon={<FaFileImport />}
                        size="sm"
                        onClick={handleImportClick}
                      >
                        Import
                      </Button>
                      {selectedConversations.size > 0 && (
                        <>
                          <Button
                            leftIcon={<FaFileExport />}
                            size="sm"
                            onClick={() => onBulkExport(Array.from(selectedConversations))}
                          >
                            Export ({selectedConversations.size})
                          </Button>
                          <Button
                            leftIcon={<FaTrash />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => {
                              onBulkDelete(Array.from(selectedConversations));
                              setSelectedConversations(new Set());
                            }}
                          >
                            Delete ({selectedConversations.size})
                          </Button>
                        </>
                      )}
                    </HStack>
                  </VStack>
                  <Divider my={2} />
                  {filteredConversations.map(([id, conv]) => (
                    <MenuItem
                      key={id}
                      onClick={() => onSelectConversation(id)}
                      bg={selectedConversation === id ? bgColor : undefined}
                      borderRadius="md"
                      mb={2}
                      p={2}
                    >
                      <VStack align="start" spacing={1} w="100%">
                        <HStack justify="space-between" w="100%" onClick={e => e.stopPropagation()}>
                          <HStack onClick={e => e.stopPropagation()}>
                            <Box onClick={e => e.stopPropagation()}>
                              <Checkbox
                                isChecked={selectedConversations.has(id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setSelectedConversations(prev => {
                                    const next = new Set(prev);
                                    if (next.has(id)) {
                                      next.delete(id);
                                    } else {
                                      next.add(id);
                                    }
                                    return next;
                                  });
                                }}
                              />
                            </Box>
                            <Text fontWeight="bold">
                              {conv.name}
                              {conv.pinned && (
                                <Badge ml={2} colorScheme="blue">
                                  Pinned
                                </Badge>
                              )}
                            </Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Tooltip label="Pin conversation" placement="top">
                              <IconButton
                                size="xs"
                                icon={<FaThumbtack />}
                                aria-label="Pin conversation"
                                variant={conv.pinned ? "solid" : "ghost"}
                                colorScheme={conv.pinned ? "blue" : "gray"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPinConversation(id);
                                }}
                              />
                            </Tooltip>
                            <Tooltip label="Add tags" placement="top">
                              <IconButton
                                size="xs"
                                icon={<FaTag />}
                                aria-label="Add tags"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingConv(id);
                                  onOpen();
                                }}
                              />
                            </Tooltip>
                            <Tooltip label="Share conversation" placement="top">
                              <IconButton
                                size="xs"
                                icon={<FaShare />}
                                aria-label="Share conversation"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onShareConversation(id);
                                }}
                              />
                            </Tooltip>
                            <Tooltip label="Archive conversation" placement="top">
                              <IconButton
                                size="xs"
                                icon={<FaArchive />}
                                aria-label="Archive conversation"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onArchiveConversation(id);
                                }}
                              />
                            </Tooltip>
                            {id !== 'default' && (
                              <Tooltip label="Delete conversation" placement="top">
                                <IconButton
                                  size="xs"
                                  icon={<FaTrash />}
                                  aria-label="Delete conversation"
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteConversation(id);
                                  }}
                                />
                              </Tooltip>
                            )}
                          </HStack>
                        </HStack>
                        {conv.tags.length > 0 && (
                          <HStack spacing={1} flexWrap="wrap">
                            {conv.tags.map((tag, index) => (
                              <Tag
                                key={index}
                                size="sm"
                                variant="subtle"
                                colorScheme="blue"
                              >
                                <TagLabel>{tag}</TagLabel>
                                <TagCloseButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveTag(id, tag);
                                  }}
                                />
                              </Tag>
                            ))}
                          </HStack>
                        )}
                        <Text fontSize="xs" color="gray.500">
                          {getConversationPreview(conv.messages)}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {formatTime(conv.stats.lastActive)}
                        </Text>
                      </VStack>
                    </MenuItem>
                  ))}
                </TabPanel>
                <TabPanel>
                  <VStack spacing={2}>
                    <Text>Archived Conversations</Text>
                    {Object.entries(conversations)
                      .filter(([_, conv]) => conv.archived)
                      .map(([id, conv]) => (
                        <HStack key={id} w="100%" p={2} bg={bgColor} borderRadius="md">
                          <Text>{conv.name}</Text>
                          <IconButton
                            size="xs"
                            icon={<FaArchive />}
                            onClick={() => onArchiveConversation(id)}
                            aria-label="Unarchive"
                          />
                        </HStack>
                      ))}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    {Object.entries(conversations).map(([id, conv]) => (
                      <VStack key={id} align="stretch" p={3} bg={bgColor} borderRadius="md">
                        <Text fontWeight="bold">{conv.name}</Text>
                        <HStack justify="space-between">
                          <Text>Messages:</Text>
                          <Text>{conv.stats.messageCount}</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text>User Messages:</Text>
                          <Text>{conv.stats.userMessageCount}</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Assistant Messages:</Text>
                          <Text>{conv.stats.assistantMessageCount}</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text>Avg Response Time:</Text>
                          <Text>{formatDuration(conv.stats.averageResponseTime)}</Text>
                        </HStack>
                        <Text fontSize="xs" color="gray.500">
                          Last Active: {formatTime(conv.stats.lastActive)}
                        </Text>
                      </VStack>
                    ))}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </MenuList>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingConv ? 'Edit Conversation' : 'New Conversation'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Enter conversation name"
                value={newConvName}
                onChange={(e) => setNewConvName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    editingConv ? handleRenameConversation() : handleCreateConversation();
                  }
                }}
              />
              {editingConv && (
                <VStack align="stretch" w="100%">
                  <HStack>
                    <Input
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newTag.trim()) {
                          onAddTag(editingConv, newTag.trim());
                          setNewTag('');
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (newTag.trim()) {
                          onAddTag(editingConv, newTag.trim());
                          setNewTag('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </HStack>
                  <HStack spacing={2} flexWrap="wrap">
                    {conversations[editingConv]?.tags.map((tag, index) => (
                      <Tag key={index} size="md">
                        <TagLabel>{tag}</TagLabel>
                        <TagCloseButton
                          onClick={() => onRemoveTag(editingConv, tag)}
                        />
                      </Tag>
                    ))}
                  </HStack>
                </VStack>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={editingConv ? handleRenameConversation : handleCreateConversation}
            >
              {editingConv ? 'Save' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileChange}
      />
    </>
  );
};

export default ConversationManager;
