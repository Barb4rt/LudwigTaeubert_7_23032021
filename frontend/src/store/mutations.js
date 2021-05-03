import axios from "axios";
import Vue from "vue";

export default {
  SET_USER_DATA(state, userData) {
    state.user = userData;
    const userToken = {"token" : userData.token }
    localStorage.setItem("user", JSON.stringify(userToken) );
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
  },
  LOGOUT() {
    localStorage.removeItem("user");
    location.reload();
  },
  GET_ALL_EVENT(state, events) {
    state.events = events;
  },
  FILTER_POST(state, filter){
    let filteredPost = []
    state.events.forEach(element => {
      if(element.tag == filter){
        filteredPost.push(element)
      }
    });
    state.filteredPost = filteredPost
    console.log(state.filteredPost); 
  },
  GET_USER_EVENT(state, events) {
    state.events = events;
  },
  SET_ALL_USERS(state, users){
    state.listOfUsers = users
  },
  GET_USER_PROFIL(state, userProfil) {
    if(userProfil.data){
      state.userProfil = userProfil.data
    }else
    {state.userProfil = userProfil
      state.userConnect = userProfil.id};
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
