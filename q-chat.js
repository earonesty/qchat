(function () {
  function getRelativeURL(fil) {
    let cs = document.currentScript
    if (cs) cs.id = "q-chat"
    // fixes event-firing situations
    if (!cs) cs = document.getElementById("q-chat")
    let ret = cs ? (new URL(".", cs.src) + fil) : fil
    return ret
  }

  // Inject default CSS if a custom one doesn't exist
  injectDefaultCSS();
  
  // Create and insert the chat button
  const chatButton = document.createElement('div');
  chatButton.id = 'chat-button';
  chatButton.innerHTML = '<img src="' + getRelativeURL("q-chat.svg") + '" alt="Chat" style="width: 40px; height: 40px;">';  // <-- This line is changed
  document.body.appendChild(chatButton);

  // Create and insert the chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'chat-window';

  // Create and insert the chat messages div and the input textarea
  const messagesDiv = document.createElement('div');
  messagesDiv.id = 'messages-div';

  // input wrapper
  const inputWrapper = document.createElement('div');
  inputWrapper.id = 'input-wrapper';

  const inputField = document.createElement('textarea');
  inputField.id = 'input-field';

  const sendButton = document.createElement('div');
  sendButton.innerHTML = '<img src="' + getRelativeURL("q-chat-send.svg") + '" alt="Send" style="width: 24px; height: 24px; cursor: pointer;">';

  sendButton.id = "send-button";

  inputWrapper.appendChild(inputField);
  inputWrapper.appendChild(sendButton);

  chatWindow.appendChild(messagesDiv);
  chatWindow.appendChild(inputWrapper);

  document.body.appendChild(chatWindow);

  // Add the chat button click event
  chatButton.addEventListener('click', function () {
    const imgElement = chatButton.querySelector('img');
    if (chatWindow.style.display === 'none' || !chatWindow.style.display) {
      chatWindow.style.display = 'block';
      imgElement.src = getRelativeURL('q-chat-close.svg');  // Change to the close icon
    } else {
      chatWindow.style.display = 'none';
      imgElement.src = getRelativeURL('q-chat.svg');  // Change back to the chat icon
    }
  });

  function sendInput() {
    qChat.sendMessage(inputField.value)
    inputField.value = "";
  }

  function sendMessage(content) {
      // Create a 'beforeMessageSend' event
      const beforeMessageSendEvent = new CustomEvent("qChatBefore", {
        detail: { content },
        cancelable: true // This allows the event to be canceled
      });

      // Dispatch the event and check if it was canceled
      if (!document.dispatchEvent(beforeMessageSendEvent)) {
        return; // The event was canceled, so we stop here
      }

      // Display the message in messagesDiv or send to a server
      const message = beforeMessageSendEvent.detail.content;
      messagesDiv.innerHTML += `<div class='user-message'>${content}</div>`;

      // Create an 'afterMessageSend' event
      const afterMessageSendEvent = new CustomEvent("qChatAfter", {
        detail: { content }
      });

      // Dispatch the 'afterMessageSend' event
      document.dispatchEvent(afterMessageSendEvent);
  }

    // Function to receive a message (from your server, for instance)
  function receiveMessage(content) {
      // Display the message in messagesDiv
      messagesDiv.innerHTML += `<div class='server-message'>${content}</div>`;
  }

  document.addEventListener("qChatReceive", function(e) {
      qChat.receiveMessage(e.detail.content);
  });

  function onSend(func) {
    document.addEventListener("qChatBefore", function(e) {
      if (!func(e.detail.content)) {
        e.preventDefault()
      }
    });
  }

  function getMessages() {
    const messages = [];
    const messageElements = messagesDiv.querySelectorAll('.user-message, .server-message');

    messageElements.forEach(el => {
      const role = el.classList.contains('user-message') ? 'user' : 'server';
      const content = el.textContent;
      messages.push({ role, content });
    });

    return messages;
  }

  function setMessages(messageArray) {
    this.messagesDiv.innerHTML = '';
    messageArray.forEach(msgObj => {
      if (msgObj.role === 'user') {
        qChat.sendMessage(msgObj.content);
      } else {
        qChat.receiveMessage(msgObj.content);
      }
    });
  }

  function setTitle(title) {
    let titleElement = document.getElementById('chat-title');
    if (!titleElement) {
      // Create title element if it doesn't exist
      titleElement = document.createElement('div');
      titleElement.id = 'chat-title';
     // Insert the title at the top of the chat window
      chatWindow.insertBefore(titleElement, chatWindow.firstChild);
    }
    titleElement.textContent = title;
  }

  const qChat = {
    receiveMessage,
    sendMessage,
    onSend,
    getMessages,
    setMessages,
    setTitle
  }

  window.qChat = qChat

  // Add the input textarea event
  inputField.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendInput();
    }
  });

  // Add the send button click event
  sendButton.addEventListener('click', sendInput);

  function injectDefaultCSS() {
      // Check if the custom style is already added by looking for a link element with the specific id
      if (!document.getElementById('q-chat-css')) {
        const defaultStyle = `
        /* chat-widget.css */
#chat-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  background-color: blue;
}

#chat-window {
  display: none;
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 999;
  width: 300px;
  height: 400px;
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
}

#messages-div {
  border: 1px solid black;
  overflowY: scroll;
  height: 300px;
  margin: 10px;
  padding: 5px;
}

#input-field {
  /* Your styles for input textarea */
  resize: none;
  width: 280px;
  height: 50px;
  margin-left: 10px;
}

#send-button img {
  width: 24px;
  height: 24px;
  cursor: pointer;
  padding-right: 10px;
}

#chat-title {
  backgroundColor: gray;
  color: white;
  padding: 10px;
}

.user-message {
  color: #000;
}

.server-message {
  color: #007;
  text-align: right;
}

#input-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#send-button {
  margin-left: 10px;
}
        `
        const styleElement = document.createElement('style');
        styleElement.id = 'q-chat-css';
        styleElement.type = 'text/css';
        styleElement.appendChild(document.createTextNode(defaultStyle));
        document.head.appendChild(styleElement);
      }
    }

})();
