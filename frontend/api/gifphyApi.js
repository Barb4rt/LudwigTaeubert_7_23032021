import axios from "axios";

const endpoint = "https://api.giphy.com/v1/gifs";

export default {
  searchGif(term) {
    return axios.get(
      `${endpoint}/search?api_key=G1mQgUOk1qn3WGJodRRqK1gf1lIXAO3t&q=${term}&limit=48&offset=0&rating=g&lang=fr`
    );
  },
  getGif() {
    return axios.get(
      `${endpoint}/trending?api_key=G1mQgUOk1qn3WGJodRRqK1gf1lIXAO3t&limit=24&rating=g`
    );
  },
};
