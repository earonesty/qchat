const fs = require('fs');

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = '<!doctype html><html><head></head><body></body></html>';

let dom;
let container;

// Mocking document.currentScript property.
Object.defineProperty(document, 'currentScript', {
  value: { src: 'http://example.com/static/q-chat.js' },
  writable: false
});

// Load the function from the script
let scriptContent = fs.readFileSync(path.join(__dirname, '../q-chat.js'), 'utf8');

beforeEach(() => {
  // Setup a new JSDOM instance with the function injected
  dom = new JSDOM(html, { runScripts: 'dangerously' });
  dom.window.eval(scriptContent);
  container = dom.window.document.body;
  global.document = dom.window.document;
});

describe('Chat Widget Functionality', () => {

    test('should insert chat button', () => {
        const chatButton = container.querySelector('#chat-button');
        expect(chatButton).toBeDefined();
    });

    test('should insert chat window', () => {
        const chatWindow = container.querySelector('#chat-window');
        expect(chatWindow).toBeDefined();
    });

    test('chat window should toggle on button click', () => {
        const chatButton = container.querySelector('#chat-button');
        const chatWindow = container.querySelector('#chat-window');
        chatButton.dispatchEvent(new dom.window.MouseEvent('click'));
        expect(chatWindow.style.display).toBe('block');
        chatButton.dispatchEvent(new dom.window.MouseEvent('click'));
        expect(chatWindow.style.display).toBe('none');
    });

    test('should send a message and dispatch events', () => {
        const chatInput = container.querySelector('#input-field');
        const sendButton = container.querySelector('#send-button');

        const mockSendBeforeEvent = jest.fn();
        const mockSendAfterEvent = jest.fn();

        dom.window.document.addEventListener('qChatBefore', mockSendBeforeEvent);
        dom.window.document.addEventListener('qChatAfter', mockSendAfterEvent);

        chatInput.value = 'Hello, world!';
        sendButton.dispatchEvent(new dom.window.MouseEvent('click'));

        expect(mockSendBeforeEvent).toHaveBeenCalled();
        expect(mockSendAfterEvent).toHaveBeenCalled();

        const sentMessage = container.querySelector('.user-message');
        expect(sentMessage.textContent).toBe('Hello, world!');
    });

    test('should receive a message and append to chat window', () => {
        const messagesDiv = container.querySelector('#messages-div');
        const receiveEvent = new dom.window.CustomEvent("qChatReceive", { detail: { content: 'Hello from server' }});

        dom.window.document.dispatchEvent(receiveEvent);

        const receivedMessage = messagesDiv.querySelector('.server-message');
        expect(receivedMessage).toBeDefined();
        expect(receivedMessage.textContent).toBe('Hello from server');
    });


    test('should receive a message via api', () => {
        const messagesDiv = container.querySelector('#messages-div');
        dom.window.qChat.receiveMessage('Hello from server');
        const receivedMessage = messagesDiv.querySelector('.server-message');
        expect(receivedMessage).toBeDefined();
        expect(receivedMessage.textContent).toBe('Hello from server');
    });

    // Add other tests as necessary
});
