// alarmList
import * as  SERVICES  from '../services/api';

export default {
  namespace: 'alarm',

  state: {
    list: [],
    history: [],
  },

  effects: {
    *fetchList({payload}, { call, put }) {
      const response = yield call(SERVICES.qeuryAlarmList,payload);
      yield put({
        type: 'saveList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *add({payload}, { call }) {
      const response = yield call(SERVICES.alarmAdd,payload);
      return response;
    },
    *update({payload}, { call }) {
      const response = yield call(SERVICES.alarmUpdate,payload);
      return response;
    },
    *getHistory(_, {call, put}) {
      const {data} = yield call(SERVICES.queryAlarmHistory);
      yield put({
        type: 'saveHistory',
        payload: Array.isArray(data) ? data : [],
      })
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveHistory(state, {payload}) {
      return {
        ...state,
        history: payload,
      }
    },
  },
};