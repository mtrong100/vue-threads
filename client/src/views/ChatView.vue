<script setup>
import Textarea from "primevue/textarea";
import Button from "primevue/button";

const chats = [
  {
    id: 1,
    username: "Alice",
    avatar: "https://via.placeholder.com/40",
    lastMessage: "Hey, how are you?",
    messages: [
      { id: 1, text: "Hey, how are you?", sentByUser: false },
      { id: 2, text: "I'm good, thanks!", sentByUser: true },
    ],
  },
];

const activeChat = chats[0];
let messageText = "";

function sendMessage() {
  if (messageText.trim()) {
    activeChat.messages.push({
      id: activeChat.messages.length + 1,
      text: messageText,
      sentByUser: true,
    });
    messageText = "";
  }
}
</script>

<template>
  <div class="chat-container">
    <div class="chat-sidebar">
      <div class="sidebar-header">
        <h2>Chats</h2>
      </div>
      <ul class="chat-list">
        <li class="chat-item" v-for="chat in chats" :key="chat.id">
          <img :src="chat.avatar" alt="Avatar" class="avatar" />
          <div class="chat-info">
            <h3>{{ chat.username }}</h3>
            <p>{{ chat.lastMessage }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="chat-main">
      <div class="chat-header">
        <img :src="activeChat.avatar" alt="Avatar" class="avatar" />
        <h3>{{ activeChat.username }}</h3>
      </div>
      <div class="chat-messages">
        <div
          v-for="message in activeChat.messages"
          :key="message.id"
          :class="['message', message.sentByUser ? 'sent' : 'received']"
        >
          <p>{{ message.text }}</p>
        </div>
      </div>
      <div class="chat-input">
        <Textarea
          v-model="messageText"
          autoResize
          rows="4"
          cols="30"
          placeholder="Type your message..."
          style="width: 100%"
        />

        <Button label="Send" icon="pi pi-send" style="flex-shrink: 0" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  padding: 30px 0;
  display: flex;
  height: calc(100vh - 60px);
}

.chat-sidebar {
  width: 30%;
  background-color: #f1f1f1;
  padding: 20px;
}

.sidebar-header {
  font-size: 24px;
  color: #42b883;
  margin-bottom: 20px;
}

.chat-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.chat-item:hover {
  background-color: #e8f9f4;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.chat-info {
  flex: 1;
}

.chat-info h3 {
  font-size: 16px;
  margin: 0 0 5px;
}

.chat-info p {
  margin: 0;
  font-size: 14px;
  color: #888;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 20px;
  background-color: #42b883;
  color: white;
  display: flex;
  align-items: center;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.message {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  max-width: 60%;
}

.sent {
  background-color: #42b883;
  color: white;
  margin-left: auto;
}

.received {
  background-color: #e8f9f4;
  color: #333;
  align-self: flex-start;
}

.chat-input {
  display: flex;
  padding: 20px;
  background-color: #f1f1f1;
  gap: 5px;
}
</style>
