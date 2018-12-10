import { queryProjectNotice, queryWorkList } from '../services/api';

export default {
  namespace: 'project',

  state: {
    notice: [],
    workList: [],
  },

  effects: {
    *fetchNotice(_, { call, put }) {
      const response = yield call(queryProjectNotice);
      yield put({
        type: 'saveNotice',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *getWorkList({ params }, { call, put }) {
      const response = yield call(queryWorkList, params);
      yield put({
        type: 'saveWorkList',
        payload: Array.isArray(response.data.menus) ? response.data.menus : [],
      });
    },
  },

  reducers: {
    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },
    saveWorkList(state, { payload }) {
      return {
        ...state,
        workList: payload,
      };
    },
  },
};
