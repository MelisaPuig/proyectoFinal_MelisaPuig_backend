const socket = io.connect();

const HANDLEBARS_CHATS_URL = '/public/hbs/chats.hbs';
const SYSTEM_AVATAR = '/public/imgs/system.png';

let chatMessages = [];

function sendMessage(event, message) {
  socket.emit(event, message);
}

async function getChatHTML() {
  return renderHandlebars(HANDLEBARS_CHATS_URL, { messages: chatMessages });
}

async function getUserMail() {
  const userData = await getUserData();
  return userData.email;
}

async function getChatMessages() {
  const userMail = await getUserMail();
  sendMessage('getChats', { userMail });
}

function adaptChatMessage(message, userData) {
  const adaptedMessage = { ...message };
  if (message.type === 'user') {
    adaptedMessage.avatar = userData.profilePicture;
    adaptedMessage.name = userData.name;
  } else {
    adaptedMessage.avatar = SYSTEM_AVATAR;
    adaptedMessage.name = 'System';
  }
  adaptedMessage.date = formatDate(new Date(message.date));
  return adaptedMessage;
}

async function chatSendMessage() {
  const userMail = await getUserMail();
  const userMessageInput = document.getElementById('chat__user_message');
  const body = userMessageInput.value;
  sendMessage('newMessage', { body, userMail });
  userMessageInput.value = '';
}

socket.on('chatMessages', async (messages) => {
  const userData = await getUserData();
  const adaptedMessages = messages.map((e) => adaptChatMessage(e, userData));
  chatMessages = [...chatMessages, ...adaptedMessages];
  const chatsHTML = await getChatHTML();
  const chatMessagesDiv = document.getElementById('chat__messages');
  chatMessagesDiv.innerHTML = chatsHTML;
  chatMessagesDiv.scroll({ top: chatMessagesDiv.scrollHeight, behavior: 'smooth' });
});

document.addEventListener(
  'DOMContentLoaded',
  async function () {
    getChatMessages();
  },
  false,
);
