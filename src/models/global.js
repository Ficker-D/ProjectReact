// 全局需要使用的一些个仓库数据，比方说菜单配置、用户信息、
import request from '../utils/request';
import { message } from 'antd';

const userData = window.sessionStorage.getItem('user');
const jwtData = window.sessionStorage.getItem('jwt');

export default {
  namespaced: 'global',

  state: {
    // 菜单集合
    menus: [
      { id: 1, icon: 'user', name: 'Welcome', href: '/', role: '' },
      { id: 2, icon: 'video-camera', name: '用户管理', href: '/user/manage', role: 'admin' },
      // { id: 3, icon: 'video-camera', name: '文章管理', href: '/post/manage', role: 'admin' },
    ],

    // 当前登录的用户个人信息
    user: userData ? JSON.parse(userData) : null,
    jwt: jwtData ? JSON.parse(jwtData) : null,
  },

  reducers: {
    login(state, action) {
      return {
        ...state,
        ...{
          user: action.user,
          jwt: action.jwt,
        },
      };
    },
  },

  effects: {
    *loginSync(action, { put }) {
      // 1. 发送ajax请求
      const result = yield request.post('/api/v1/auth', action.payload);
      // 2. 输出登录成功
      message.success('登录成功');
      // 3. 调用 login 这个 reducer
      yield put({ type: 'login', user: result.data.user, jwt: result.data.jwt });
      // 4. 本地存储
      window.sessionStorage.setItem('user', JSON.stringify(result.data.user));
      window.sessionStorage.setItem('jwt', JSON.stringify(result.data.jwt));
      // 5. 跳转页面至首页
      action.history.replace('/');
    },
  },
};
