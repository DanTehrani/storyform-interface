import axiosBase from "axios";

const axios = axiosBase.create({
  baseURL: process.env.STORY_URL || "http://localhost:4000"
});

export default axios;
