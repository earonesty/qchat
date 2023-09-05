# q-chat Widget

The `q-chat` widget is a simple, customizable chat UI that you can easily integrate into any web project. It provides a chat button that users can click to open a chat window. The widget allows users to send messages, and it's designed to be integrated with a server or other backends to manage chat sessions.

## Features

- Toggleable chat window
- Customizable look via CSS
- Easy-to-hook event system for custom backend integrations
- Lightweight, with no external dependencies
- SVG-based icons for scalability and customization
- Includes 'Send' button in addition to 'Enter' key for message sending

## Installation

To install the `q-chat` widget, you can include the JavaScript and CSS files in your HTML:

```html
<script src="/path/to/q-chat.js"></script>
<link rel="stylesheet" href="/path/to/q-chat.css" id="q-chat-css">
```

Make sure to replace `/path/to/` with the actual path to the widget files.

## Usage

Once you've included the widget files, the chat UI should be automatically activated on your webpage.

### JavaScript Events

The `q-chat` widget emits the following custom events:

- `qChatBefore`: Fired before a message is sent. Can be canceled/edited.
- `qChatAfter`: Fired after a message is sent.

Example to hook into the `qChatBefore` event:

```javascript
document.addEventListener('qChatBefore', function(event) {
  console.log("Before message send:", event.detail.content);
});
```

You can also send a message to the chat UI using the `qChatReceive` event like this:

```javascript
document.dispatchEvent(new CustomEvent("qChatReceive", {
  detail: { content: "Hello from server" }
}));
```

## Customization

The chat widget is styled using CSS, and you can override these styles to better fit the widget into your application. The following are the main CSS IDs used within the widget:

If a css sheet is already loaded, with id "q-chat-css", then the default styles will not be applied.

### Main Components

- `#chat-button`: The floating chat button.
- `#chat-window`: The main chat window.
- `#messages-div`: The container for all chat messages.
- `#input-wrapper`: The wrapper for the input field and the send button.

### Input and Buttons

- `#input-field`: The text area where users can type messages.
- `#send-button`: The button to send messages.


## API

The widget exposes a global object `qChat` with methods for programmatic interaction:

- `qChat.sendMessage(content)`: Send a message as the user.
- `qChat.receiveMessage(content)`: Receive a message as the server/assistant.
- `qChat.getMessages()`: Retrieve the list of all messages in the format `[{"role": "assistant", "content": "message"}, {"role": "user", "content": "message"}]`.
- `qChat.setMessages(messages)`: Set all messages from a loaded context or history.

## Contributing

Feel free to fork this project, open issues, or submit PRs. For major changes, please open an issue first.

## License

MIT License
