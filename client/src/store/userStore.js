import {
  getFriendsApi,
  getUserDetailsApi,
  getUsersApi,
  toggleFollowUserApi,
} from "@/apis/userApi";
import { USER_LIMIT } from "@/utils/constants";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    friends: [],
    currentUser: JSON.parse(localStorage.getItem("VUE_THREADS_USER")) || null,
    loadingUsers: false,
    loadingFriends: false,
    hasMoreUsers: false,
    totalUsers: 0,
    search: "",
    userDetails: null,
  }),
  actions: {
    saveCurrentUser(user) {
      this.currentUser = user;
      localStorage.setItem("VUE_THREADS_USER", JSON.stringify(user));
    },
    removeCurrentUser() {
      this.currentUser = null;
      localStorage.removeItem("VUE_THREADS_USER");
    },
    async fetchUsers({ skip = 0, isMergeState = false, query = "" } = {}) {
      this.loadingUsers = true;

      try {
        const response = await getUsersApi({
          skip,
          query,
          limit: USER_LIMIT,
        });

        if (response) {
          if (isMergeState) {
            this.users = [...this.users, ...response.results];
            this.totalUsers = response.totalUsers;
            this.hasMoreUsers = response.hasMoreUsers;
          } else {
            this.users = response.results;
            this.totalUsers = response.totalUsers;
            this.hasMoreUsers = response.hasMoreUsers;
          }
        }
      } catch (error) {
        console.log("Error fetching users:", error.message);
        this.users = [];
      } finally {
        this.loadingUsers = false;
      }
    },
    async toggleFollowUser(followerId) {
      try {
        await toggleFollowUserApi(followerId);
      } catch (error) {
        console.log("Error following user:", error.message);
      } finally {
        this.fetchUsers();
      }
    },
    async fetchUserCurrentUser(userId) {
      try {
        const response = await getUserDetailsApi(userId);

        if (response) {
          this.currentUser = response;
          localStorage.setItem("VUE_THREADS_USER", JSON.stringify(response));
        }
      } catch (error) {
        console.log("Error fetching user details:", error.message);
      }
    },
    async fetchUserDetails(userId) {
      try {
        const response = await getUserDetailsApi(userId);

        if (response) {
          this.userDetails = response;
        }
      } catch (error) {
        console.log("Error fetching user details:", error.message);
      }
    },
    async fetchFriends() {
      this.loadingFriends = true;

      try {
        const response = await getFriendsApi();
        if (response) {
          this.friends = response.results;
        }
      } catch (error) {
        console.log("Error fetching friends:", error.message);
      } finally {
        this.loadingFriends = false;
      }
    },
  },
});
