import axios from "axios";

export const get = (url, params = null) => {
  return axios.get(url, params);
};

export const post = (url, params = null) => {
  return axios.post(url, params);
};
