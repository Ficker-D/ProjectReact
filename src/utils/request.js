import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: 'http://58.87.126.209:3333',
  timeout: 2 * 1000, // 网络超时时间的设置
});

// 请求拦截
request.interceptors.request.use(
  config => {
    let jwtData = window.sessionStorage.getItem('jwt');
    if (jwtData) {
      jwtData = JSON.parse(jwtData);
      config.headers['Authorization'] = `Bearer ${jwtData.token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 响应拦截
request.interceptors.response.use(
  response => {
    // 统一做错误提示
    let result = response.data;
    if (result.code !== 0) {
      message.error(result.msg);
      // 直接调用reject,让后续流程不在继续
      return Promise.reject(result.msg);
    }
    return response.data;
  },
  error => {
    // 根据 http 状态码，来报错
    // 1. 获取状态码
    console.log(error.response);
    let status = error.response.status;
    if (status === 401) {
      // token有问题
      message.error('token有问题');
    }
    return Promise.reject(error);
  },
);

export default request;
