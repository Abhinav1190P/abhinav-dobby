import axios from "axios";

const baseURL = 'https://abhinav-dobby-api.vercel.app'

export default axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export const axiosPrivate = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});