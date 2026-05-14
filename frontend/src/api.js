import axios from "axios";

const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use(function(config) {
  const user = JSON.parse(localStorage.getItem("helpdeskUser") || "null");
  if (user && user.token) {
    config.headers.Authorization = "Bearer " + user.token;
  }
  return config;
});

export default API;