import axios from "axios";
import Vue from "vue";

export default {
  SET_USER_DATA(state, userData) {
    if(userData.token){
      state.user = userData.user;
      const userToken = {"token" : userData.token }
      localStorage.setItem("user", JSON.stringify(userToken) );
      axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    }else{
      state.user = userData
    }
    
  },
  LOGOUT() {
    localStorage.removeItem("user");
    location.reload();
  },
  GET_ALL_EVENT(state, events) {
    state.events = events;
  },
  FILTER_POST(state, filter){
    if(filter){
      let filteredPost = []
      state.events.forEach(element => {
        if(filter.includes(element.tag)){
          filteredPost.push(element)
        }
      });
      state.filteredPost = filteredPost

    }
    else{
      state.filteredPost = null
    }
  },
  GET_USER_EVENT(state, events) {
    state.events = events;
  },
  SET_ALL_USERS(state, users){
    state.listOfUsers = users
  },
  PROFIL_TO_SHOW(state, userId){
    for (let index = 0; index < state.listOfUsers.length; index++) {
      const element = state.listOfUsers[index];
        if(element.id === userId){
          state.userToShow = element
        }
    }
  },
  UPDATE_STATUS(state, status) {
    Vue.set(state, 'status', status)
  }
};
