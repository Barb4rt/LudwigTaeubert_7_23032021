import Vue from "vue";
import Vuex from "vuex";
import * as getters from "./getters";
import * as actions from "./actions";
import mutations from "./mutations";

Vue.use(Vuex);

const state = {
  user: null,
  events: [],
  filteredPost:null,
  userProfil: null,
  listOfUsers: null,
  status: 'pending',
  post:null,
  userToShow:null
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
});
