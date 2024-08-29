import axios from "axios";

axios.defaults.baseURL = "http://localhost:23500";

axios.interceptors.response.use((response) => {
  // 确保响应数据符合ResponseData接口的结构
  return response.data;
});

export { axios as request };