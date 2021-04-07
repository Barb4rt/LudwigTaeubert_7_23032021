import axios from 'axios'

const endpoint = 'http://localhost:8081/api'

export default {
  getAllEvents() {
    return axios.get(`${endpoint}/messages`)
  },
  getUsersEvents() {
    return axios.get(`${endpoint}/users/messages`)
  }
}