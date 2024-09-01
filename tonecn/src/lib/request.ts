import axios from "axios";

axios.defaults.baseURL = "http://localhost:23500";

axios.interceptors.response.use((response) => {
  // 确保响应数据符合ResponseData接口的结构
  return response.data;
});

axios.interceptors.request.use((request) => {
  if (localStorage.getItem('jwtToken')) {
    request.headers['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
  }
  return request;
})

export { axios as request };