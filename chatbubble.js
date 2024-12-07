(function() {
    const container = document.getElementById('chatbubble-container');
    
    // Create and inject the ChatBubble styles
    const style = document.createElement('style');
    style.textContent = `
        .chat-bubble {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        
        .chat-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #4299E1;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
        }
        
        .chat-button:hover {
            transform: scale(1.1);
        }
        
        .chat-window {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: none;
            overflow: hidden;
        }
        
        .chat-window.open {
            display: flex;
            flex-direction: column;
        }
        
        .chat-header {
            padding: 15px;
            background: #4299E1;
            color: white;
            font-weight: bold;
        }
        
        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
        }
        
        .chat-input {
            padding: 15px;
            border-top: 1px solid #eee;
            display: flex;
        }
        
        .chat-input input {
            flex: 1;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-right: 8px;
        }
        
        .chat-input button {
            padding: 8px 15px;
            background: #4299E1;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .chat-input button:hover {
            background: #3182CE;
        }
    `;
    document.head.appendChild(style);
    
    // Create the ChatBubble HTML
    const chatBubbleHTML = `
        <div class="chat-bubble">
            <button class="chat-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
            </button>
            <div class="chat-window">
                <div class="chat-header">Chat with AI Assistant</div>
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" placeholder="Type your message...">
                    <button>Send</button>
                </div>
            </div>
        </div>
    `;
    
    // Insert the ChatBubble into the container
    container.innerHTML = chatBubbleHTML;
    
    // Add functionality
    const chatButton = container.querySelector('.chat-button');
    const chatWindow = container.querySelector('.chat-window');
    const chatInput = container.querySelector('.chat-input input');
    const sendButton = container.querySelector('.chat-input button');
    const messagesContainer = container.querySelector('.chat-messages');
    
    // Toggle chat window
    chatButton.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
    });
    
    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.style.textAlign = 'right';
            userMessage.style.margin = '10px 0';
            userMessage.innerHTML = `<span style="background: #4299E1; color: white; padding: 8px 12px; border-radius: 15px; display: inline-block;">${message}</span>`;
            messagesContainer.appendChild(userMessage);
            
            // Clear input
            chatInput.value = '';
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Here you would typically make an API call to your chatbot backend
            // For now, we'll just echo back a response
            setTimeout(() => {
                const botMessage = document.createElement('div');
                botMessage.style.margin = '10px 0';
                botMessage.innerHTML = `<span style="background: #EDF2F7; padding: 8px 12px; border-radius: 15px; display: inline-block;">I received your message: "${message}"</span>`;
                messagesContainer.appendChild(botMessage);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 1000);
        }
    }
    
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
})();
