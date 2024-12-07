import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatBubble from './components/ChatBubble';

class AIChatWidget {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    // Create container
    const container = document.createElement('div');
    container.id = 'ai-chatbot-container';
    document.body.appendChild(container);
    
    // Render chat bubble
    const root = createRoot(container);
    root.render(<ChatBubble />);
    
    this.initialized = true;
  }
}

// Create global instance
window.AIChatWidget = new AIChatWidget();

// Auto-initialize if the script has auto-init attribute
if (document.currentScript?.getAttribute('auto-init') === 'true') {
  window.AIChatWidget.init();
}
