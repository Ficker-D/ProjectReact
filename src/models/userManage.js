import request from '../utils/request';

export default {
  namespaced: 'userManage',

  state: {
    userList: [],
    total: 1, // 用户的总条数
  },

  reducers: {
    setUserList(state, action) {
      return {
        ...state,
        ...{
          userList: action.userList,
          total: action.total,
        },
      };
    },
  },

  effects: {
    *getUserList(action, { put }) {
      const result = yield request.get('/api/v1/users', {
        params: {
          page: action.page || 1,
          limit: action.pageSize || 10,
        },
      });
      yield put({
        type: 'setUserList',
        userList: result.users.data,
        total: result.users.total,
      });
    },
  },

  // *deleteUser(action, { put }) {
  //   const result = yield request.delete('/api/v1/users/${id}',);
  //   yield put({
  //     type: 'setUserList',
  //     userList: result.users.data,
  //     total: result.users.total,
  //   });
  // },

};
