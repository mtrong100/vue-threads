import { getMessagesApi, sendMessageApi } from "@/apis/messageApi";
import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    messages: [],
    text: "",
    onlineUsers: [],
    socket: null,
    selectedConversation: null,
    isSending: false,
    loading: false,
  }),
  actions: {
    onSelectedConversation(conversation) {
      this.selectedConversation = conversation;
    },
    setSocket(socket) {
      this.socket = socket;
    },
    setOnlineUsers(onlineUsers) {
      this.onlineUsers = onlineUsers;
    },
    async fetchMessages() {
      if (!this.selectedConversation) return;

      this.loading = true;

      try {
        const response = await getMessagesApi(this.selectedConversation._id);
        if (response) {
          this.messages = response.results;
        }
      } catch (error) {
        console.log("Error fetching messages:", error.message);
      } finally {
        this.loading = false;
      }
    },
    async sendMessage() {
      if (!this.text.trim()) return;
      if (!this.selectedConversation) return;

      this.isSending = true;

      try {
        const body = { text: this.text };

        await sendMessageApi(this.selectedConversation._id, body);
      } catch (error) {
        console.log("Error sending message:", error.message);
      } finally {
        this.isSending = false;
        this.text = "";
        this.fetchMessages();
      }
    },
  },
});
