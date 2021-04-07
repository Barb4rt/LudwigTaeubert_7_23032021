import axios from "axios";

export default {
  SET_USER_DATA(state, userData) {
    state.user = userData;
    localStorage.setItem("user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
  },
  LOGOUT() {
    localStorage.removeItem("user");
    location.reload();
  },
  GET_ALL_EVENT(state, events) {
    state.events = events;
  },
  GET_USER_EVENT(state, events) {
    state.events = events;
  },
};
