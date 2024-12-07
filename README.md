# AI Chatbot

A modern React-based AI chatbot integrated with Chatbase, designed to be embedded in WordPress sites. This chatbot features advanced conversation management, real-time AI responses, and a clean, user-friendly interface.

## Features

- **Conversation Management**
  - Create, rename, and delete conversations
  - Pin important conversations
  - Archive old conversations
  - Tag conversations for better organization
  - Bulk actions (export/delete multiple conversations)
  - Import/Export conversations as JSON
  - Share conversations via clipboard

- **Smart Chat Interface**
  - Real-time AI responses using Chatbase API
  - Message history preservation
  - Typing indicators
  - Emoji support
  - Markdown formatting support

- **Advanced Organization**
  - Tabbed interface for active and archived chats
  - Search functionality for conversations and messages
  - Tag-based filtering
  - Conversation statistics
  - Visual indicators for pinned items

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/kornfleyks/AI-Chatbot.git
   cd AI-Chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Chatbase API credentials:
   ```
   REACT_APP_CHATBASE_API_KEY=your_api_key_here
   REACT_APP_CHATBOT_ID=your_chatbot_id_here
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## WordPress Integration

The chatbot can be integrated into WordPress sites using the included plugin in the `wordpress-plugin` directory. Follow these steps:

1. Upload the `ai-chatbot.php` file to your WordPress plugins directory
2. Activate the plugin through the WordPress admin panel
3. Configure your API keys in the WordPress settings

## Technologies Used

- React
- Chakra UI
- Chatbase API
- Local Storage for data persistence
- React Icons
- Date-fns for date formatting
- Fuse.js for search functionality

## Development

- Built with Create React App
- Uses modern React features and hooks
- Implements responsive design principles
- Follows best practices for security and performance

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
