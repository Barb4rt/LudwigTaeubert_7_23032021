import axios from "axios";
import api from "./../../api";

export const register = ({ commit }, credentials) => {
  return axios
    .post("http://localhost:8081/api/users/register", credentials)
    .then(({ data }) => {
      console.log(data);
      commit("SET_USER_DATA", data);
    });
};

export const login = ({ commit }, credentials) => {
  return axios
    .post("http://localhost:8081/api/users/login", credentials)
    .then(({ data }) => {
      commit("SET_USER_DATA", data);
    });
};

export const logout = ({ commit }) => {
  commit("LOGOUT");
};

export const getAllEvent = ({ commit }) =>
  new Promise((resolve, reject) => {
    const onSuccess = (res) => {
      commit("GET_ALL_EVENT", res.data);

      resolve(res);
    };
    const onError = (err) => {
      reject(err);
    };
    api.getAllEvents().then(onSuccess).catch(onError);
  });

export const getUsersEvent = ({ commit }) =>
  new Promise((resolve, reject) => {
    const onSuccess = (res) => {
      commit("GET_USER_EVENT", res.data);

      resolve(res);
    };
    const onError = (err) => {
      reject(err);
    };

    api.getUsersEvents().then(onSuccess).catch(onError);
  });
