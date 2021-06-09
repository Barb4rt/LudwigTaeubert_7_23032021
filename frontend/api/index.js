import axios from 'axios'

const endpoint = 'http://localhost:8081/api'

export default {
  //users routes
  register(){
    return axios.post(`${endpoint}/user/register/`)
  },
  login(){
    return axios.post(`${endpoint}/user/login/`)
  },
  modifyUserProfil(){
    return axios.put(`${endpoint}/user/me/`)
  },
  getUserProfil(){
    return axios.get(`${endpoint}/user/me/`)
  },
  getAllUsers(){
    return axios.get(`${endpoint}/users/all`)
  },
  destroyProfil(data){
    return axios.delete(`${endpoint}/user/${data}`)
  },
  adminDestroyProfil(data){
    return axios.delete(`${endpoint}/admin/users/${data}`)
  },
  //Post routes
  createPost(){
    return axios.post(`${endpoint}/messages/new/`)
  },
  getAllPost() {
    return axios.get(`${endpoint}/messages/`)
  },
  destroyPost(data){
    return axios.delete(`${endpoint}/messages/${data}`)
  },
  adminDestroyPost(data){
    return axios.delete(`${endpoint}/admin/messages/${data}`)
  },
  likePost(data){
    return axios.post(`${endpoint}/messages/like`, data)
  },
  commentPost(data){
    return axios.post(`${endpoint}/message/comment`, data) 
  },
  destroyComment(data){
    return axios.delete(`${endpoint}/message/comment/${data}`)
  }
}