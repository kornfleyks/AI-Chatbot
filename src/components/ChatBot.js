import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  VStack,
  useToast,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
} from '@chakra-ui/react';
import EmojiPicker from 'emoji-picker-react';
import { format } from 'date-fns';
import Fuse from 'fuse.js';
// Import our new components
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import ChatHeader from './chat/ChatHeader';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [conversations, setConversations] = useState({
    default: { 
      name: 'General Chat', 
      messages: [],
      pinned: false,
      archived: false,
      tags: [],
      stats: {
        messageCount: 0,
        averageResponseTime: 0,
        lastActive: null,
        userMessageCount: 0,
        assistantMessageCount: 0
      }
    }
  });
  const [selectedConversation, setSelectedConversation] = useState('default');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const CHATBASE_API_KEY = process.env.REACT_APP_CHATBASE_API_KEY;
  const CHATBOT_ID = process.env.REACT_APP_CHATBOT_ID;

  if (!CHATBASE_API_KEY || !CHATBOT_ID) {
    console.error('Missing required environment variables. Please check your .env file.');
  }

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
    const savedSelected = localStorage.getItem('selectedConversation');
    if (savedSelected && JSON.parse(savedConversations)?.[savedSelected]) {
      setSelectedConversation(savedSelected);
    }
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Save selected conversation to localStorage and update messages
  useEffect(() => {
    localStorage.setItem('selectedConversation', selectedConversation);
    if (conversations[selectedConversation]) {
      setMessages(conversations[selectedConversation].messages);
    }
  }, [selectedConversation]);

  // Update messages in the current conversation
  useEffect(() => {
    if (selectedConversation && messages !== conversations[selectedConversation]?.messages) {
      setConversations(prev => ({
        ...prev,
        [selectedConversation]: {
          ...prev[selectedConversation],
          messages
        }
      }));
    }
  }, [messages]);

  // Scroll to bottom only when new messages are added
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1]?.role === 'assistant') {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewConversation = (name) => {
    const id = Date.now().toString();
    const newConversation = {
      name,
      messages: [],
      pinned: false,
      archived: false,
      tags: [],
      stats: {
        messageCount: 0,
        userMessageCount: 0,
        assistantMessageCount: 0,
        averageResponseTime: 0,
        lastActive: null
      }
    };

    setConversations(prev => ({
      ...prev,
      [id]: newConversation
    }));
    
    setSelectedConversation(id);
    setMessages([]);
    
    toast({
      title: 'New conversation created',
      status: 'success',
      duration: 2000,
    });
  };

  const handleRenameConversation = (id, newName) => {
    setConversations(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        name: newName
      }
    }));
    toast({
      title: 'Conversation renamed',
      status: 'success',
      duration: 2000,
    });
  };

  const handleDeleteConversation = (id) => {
    if (id === 'default') {
      toast({
        title: 'Cannot delete default conversation',
        status: 'error',
        duration: 2000,
      });
      return;
    }

    setConversations(prev => {
      const { [id]: deleted, ...rest } = prev;
      return rest;
    });

    if (selectedConversation === id) {
      setSelectedConversation('default');
    }

    toast({
      title: 'Conversation deleted',
      status: 'success',
      duration: 2000,
    });
  };

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredMessages(messages);
      return;
    }

    const fuse = new Fuse(messages, {
      keys: ['content'],
      threshold: 0.3
    });

    const results = fuse.search(searchTerm);
    setFilteredMessages(results.map(result => result.item));
  }, [searchTerm, messages]);

  const playMessageSound = () => {
    if (soundEnabled) {
      const messageSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
      messageSound.play().catch(error => console.log('Error playing sound:', error));
    }
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Message copied!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleCopyAsCode = (content) => {
    const formattedCode = '```\n' + content + '\n```';
    navigator.clipboard.writeText(formattedCode);
    toast({
      title: 'Copied as code!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
    toast({
      title: 'Chat cleared',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const exportChat = () => {
    try {
      const currentConversation = conversations[selectedConversation];
      if (!currentConversation || !currentConversation.messages.length) {
        toast({
          title: 'No messages to export',
          status: 'info',
          duration: 2000,
        });
        return;
      }

      const conversationData = {
        name: currentConversation.name,
        exportDate: new Date().toISOString(),
        messages: currentConversation.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp
        }))
      };

      const blob = new Blob([JSON.stringify(conversationData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentConversation.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Chat exported successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Failed to export chat',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const appendMessage = (role, content) => {
    const newMessage = {
      role,
      content,
      timestamp: new Date().toLocaleString(),
      id: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://www.chatbase.co/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHATBASE_API_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          chatbotId: CHATBOT_ID,
          stream: false,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (soundEnabled) {
        playMessageSound();
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from the chatbot',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    const editedMessage = messages[messageIndex];

    const updatedMessages = messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: newContent, isEdited: true } 
        : msg
    );

    const messagesUntilEdit = updatedMessages.slice(0, messageIndex + 1);
    setMessages(messagesUntilEdit);
    setIsLoading(true);

    try {
      const response = await fetch('https://www.chatbase.co/api/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CHATBASE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: newContent
          }],
          chatbotId: CHATBOT_ID,
          stream: false,
          model: 'gpt-3.5-turbo',
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage = {
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleString(),
        id: Date.now()
      };

      setMessages(prev => [...messagesUntilEdit, assistantMessage]);
      playMessageSound();

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error updating message',
        description: 'Failed to get new response from AI',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setMessages(messages);
    } finally {
      setIsLoading(false);
      setEditingMessage(null);
    }

    toast({
      title: 'Message updated',
      description: 'New response generated',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleFileUpload = (files) => {
    if (!files || files.length === 0) return;
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result;
        // Handle file content based on type
        if (file.type.startsWith('image/')) {
          appendMessage('user', `![${file.name}](${fileContent})`);
        } else {
          appendMessage('user', `Attached file: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const formatMessageTime = (timestamp) => {
    try {
      if (!timestamp) {
        return format(new Date(), 'MMM d, yyyy h:mm a');
      }

      if (typeof timestamp === 'string' && timestamp.includes(':') && timestamp.split(':').length === 3) {
        const now = new Date();
        const [hours, minutes, seconds] = timestamp.split(':');
        return format(
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), 
            parseInt(hours, 10), 
            parseInt(minutes, 10), 
            parseInt(seconds, 10)
          ),
          'MMM d, yyyy h:mm a'
        );
      }

      const date = new Date(timestamp);
      return format(date, 'MMM d, yyyy h:mm a');

    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return format(new Date(), 'MMM d, yyyy h:mm a');
    }
  };

  const handleDeleteMessage = (messageId) => {
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    setMessages(updatedMessages);
  };

  const updateConversationStats = useCallback((convId) => {
    setConversations(prev => {
      const conv = prev[convId];
      if (!conv) return prev;

      const messages = conv.messages;
      const userMessages = messages.filter(m => m.role === 'user');
      const assistantMessages = messages.filter(m => m.role === 'assistant');
      
      // Calculate average response time
      let totalResponseTime = 0;
      let responseCount = 0;
      
      for (let i = 1; i < messages.length; i++) {
        if (messages[i].role === 'assistant' && messages[i-1].role === 'user') {
          const responseTime = new Date(messages[i].timestamp) - new Date(messages[i-1].timestamp);
          totalResponseTime += responseTime;
          responseCount++;
        }
      }

      const stats = {
        messageCount: messages.length,
        userMessageCount: userMessages.length,
        assistantMessageCount: assistantMessages.length,
        averageResponseTime: responseCount > 0 ? totalResponseTime / responseCount : 0,
        lastActive: messages.length > 0 ? messages[messages.length - 1].timestamp : null
      };

      return {
        ...prev,
        [convId]: {
          ...conv,
          stats
        }
      };
    });
  }, []);

  const handleImportConversation = async (file) => {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      // Validate imported data
      if (!importedData.name || !Array.isArray(importedData.messages)) {
        throw new Error('Invalid conversation format');
      }

      const id = Date.now().toString();
      setConversations(prev => ({
        ...prev,
        [id]: {
          name: importedData.name,
          messages: importedData.messages,
          pinned: false,
          archived: false,
          tags: importedData.tags || [],
          stats: {
            messageCount: 0,
            averageResponseTime: 0,
            lastActive: null,
            userMessageCount: 0,
            assistantMessageCount: 0
          }
        }
      }));

      updateConversationStats(id);
      
      toast({
        title: 'Conversation imported successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Failed to import conversation',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handlePinConversation = (id) => {
    setConversations(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        pinned: !prev[id].pinned
      }
    }));
  };

  const handleArchiveConversation = (id) => {
    setConversations(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        archived: !prev[id].archived
      }
    }));
  };

  const handleAddTag = (id, tag) => {
    setConversations(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        tags: [...new Set([...prev[id].tags, tag])]
      }
    }));
  };

  const handleRemoveTag = (id, tag) => {
    setConversations(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        tags: prev[id].tags.filter(t => t !== tag)
      }
    }));
  };

  const handleBulkExport = (ids) => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        conversations: ids.map(id => ({
          name: conversations[id].name,
          messages: conversations[id].messages,
          tags: conversations[id].tags,
          stats: conversations[id].stats
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversations_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: `${ids.length} conversations exported successfully`,
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('Bulk export error:', error);
      toast({
        title: 'Failed to export conversations',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const handleBulkDelete = (ids) => {
    if (ids.includes('default')) {
      toast({
        title: 'Cannot delete default conversation',
        status: 'error',
        duration: 2000,
      });
      return;
    }

    setConversations(prev => {
      const newConversations = { ...prev };
      ids.forEach(id => {
        delete newConversations[id];
      });
      return newConversations;
    });

    if (ids.includes(selectedConversation)) {
      setSelectedConversation('default');
    }

    toast({
      title: `${ids.length} conversations deleted`,
      status: 'success',
      duration: 2000,
    });
  };

  const handleShareConversation = async (id) => {
    try {
      const conv = conversations[id];
      const shareData = {
        name: conv.name,
        messages: conv.messages,
        tags: conv.tags,
        stats: conv.stats
      };

      // Create a temporary sharing link (you would typically use a backend service for this)
      const blob = new Blob([JSON.stringify(shareData)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      await navigator.clipboard.writeText(url);
      
      toast({
        title: 'Sharing link copied to clipboard',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: 'Failed to share conversation',
        status: 'error',
        duration: 2000,
      });
    }
  };

  return (
    <VStack h="100vh" p={4} spacing={4} maxW="container.md" mx="auto" w="100%">
      <ChatHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleExport={exportChat}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        onNewConversation={handleNewConversation}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        onImportConversation={handleImportConversation}
        onPinConversation={handlePinConversation}
        onArchiveConversation={handleArchiveConversation}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onBulkExport={handleBulkExport}
        onBulkDelete={handleBulkDelete}
        onShareConversation={handleShareConversation}
      />

      <MessageList
        messages={searchTerm ? filteredMessages : messages}
        formatMessageTime={formatMessageTime}
        handleCopyMessage={handleCopyMessage}
        handleDeleteMessage={handleDeleteMessage}
        setEditingMessage={setEditingMessage}
        isLoading={isLoading}
        colorMode={colorMode}
        messagesEndRef={messagesEndRef}
      />

      <MessageInput
        input={input}
        setInput={setInput}
        handleSend={handleSendMessage}
        isLoading={isLoading}
        fileInputRef={fileInputRef}
        handleFileUpload={handleFileUpload}
        setShowEmojiPicker={setShowEmojiPicker}
      />

      <Modal isOpen={showEmojiPicker} onClose={() => setShowEmojiPicker(false)} size="sm">
        <ModalOverlay />
        <ModalContent>
          <EmojiPicker
            onEmojiClick={(emojiObject) => {
              setInput((prev) => prev + emojiObject.emoji);
              setShowEmojiPicker(false);
            }}
          />
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ChatBot;
