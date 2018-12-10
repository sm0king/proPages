import * as history from '../services/api';

export default {
  namespace: 'history',
  state: {
    list: [],
  },
  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(history.exportHistoryData);
      yield put({
        type: 'saveList',
        payload: response.list,
      });
    },
  },

  reducers: {
    saveList(state, {payload}) {
      return {
        ...state,
        list: payload,
      };
    },
  },
}