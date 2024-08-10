import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

interface ResponseData<T> {
  code: number;
  msg: string;
  data: T;
}

axios.interceptors.response.use((response) => {
   // 确保响应数据符合ResponseData接口的结构
   const responseData: ResponseData<any> = response.data;
   // 根据code值做不同的处理
   if (responseData.code === 200) { // 假设200为成功的code
     return responseData.data; // 当成功时，只返回data字段
   } else {
     // 当不成功时，抛出整个responseData或创建一个Error对象
     throw new Error(`请求错误: ${responseData.msg}`);
   }
});

export { axios as request };