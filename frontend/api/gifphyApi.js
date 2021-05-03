import axios from 'axios'

const endpoint = 'https://api.giphy.com/v1/'

export default {
  searchGif() {
    return axios.get(`${endpoint}/gifs/`)
  }
}