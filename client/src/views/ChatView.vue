<script setup>
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import { useUserStore } from "@/store/userStore";
import { onMounted, watch } from "vue";
import { useChatStore } from "@/store/chatStore";
import io from "socket.io-client";

const userStore = useUserStore();
const chatStore = useChatStore();

const onSelectedChat = (chat) => {
  chatStore.onSelectedConversation(chat);
};

onMounted(() => {
  userStore.fetchFriends();
});

onMounted(() => {
  if (userStore.currentUser) {
    const socket = io(`${import.meta.env.VITE_SERVER_URL}`);

    socket?.on("newMessage", (newMessage) => {
      console.log("🚀 ~ socket?.on ~ newMessage:", newMessage);
    });
  }
});

watch(
  () => chatStore.selectedConversation,
  (newValue) => {
    if (newValue) {
      chatStore.fetchMessages();
    }
  }
);
</script>

<template>
  <div class="chat-container">
    <div class="chat-sidebar">
      <div class="sidebar-header">
        <h2>Chats</h2>
      </div>
      <ul class="chat-list">
        <li
          @click="onSelectedChat(chat)"
          class="chat-item"
          v-for="chat in userStore.friends"
          :key="chat.id"
        >
          <img :src="chat.profilePicture" alt="Avatar" class="avatar" />
          <div class="chat-info">
            <h3>{{ chat.username }}</h3>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="chatStore.selectedConversation" class="chat-main">
      <div class="chat-header">
        <img
          :src="chatStore.selectedConversation.profilePicture"
          alt="Avatar"
          class="avatar"
        />
        <h3>{{ chatStore.selectedConversation.username }}</h3>
      </div>
      <div class="chat-messages">
        <div
          v-for="message in chatStore.messages"
          :key="message.id"
          :class="[
            'message',
            message.sender?._id === userStore.currentUser?._id
              ? 'sent'
              : 'received',
          ]"
        >
          <p>{{ message.text }}</p>
        </div>
      </div>
      <div class="chat-input">
        <Textarea
          v-model="chatStore.text"
          autoResize
          placeholder="Type your message..."
          style="width: 100%"
        />

        <Button
          @click="chatStore.sendMessage()"
          label="Send"
          icon="pi pi-send"
          style="flex-shrink: 0"
          :disabled="chatStore.isSending"
          :loading="chatStore.isSending"
        />
      </div>
    </div>

    <div class="no-chat" v-else>
      <h2>Select a chat to start messaging</h2>
    </div>
  </div>
</template>

<style scoped>
.no-chat {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 0 auto;
}
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
