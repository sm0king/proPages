import { queryRule, removeRule, addRule, queryDeviceOpt, queryTagOpt, qeurySysVarList, queryRegisterValue } from '../services/api';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    optData: [],
    tagData: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *getdeviceData(data, { call, put }) {
      const response = yield call(queryDeviceOpt);
      yield put({
        type: 'saveDeviceList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *getTagOpt({ id }, { call }) {
      const response = yield call(queryTagOpt, id);
      return response.data;
      // yield put({
      //   type: 'saveTayOpt',
      //   payload: Array.isArray(response.data) ? response.data : [],
      // });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *getValList({ data }, { call, put }) {
      const resData = yield call(qeurySysVarList, data);
      yield put({
        type: 'saveValList',
        payload: resData,
      });
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *upOpt({ data }, { put }) {
      yield put({
        type: 'upDeviceList',
        payload: data,
      });
    },
    *getRegisterValue({ data }, { call, take, put }) {
      yield put({ type: 'getValList', data });
      yield take('getValList/@@end');
      const resData = yield call(queryRegisterValue, data);
      yield put({
        type: 'saveValList',
        payload: resData,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveDeviceList(state, { payload }) {
      const optData = payload.map((item) => {
        return {
          label: item.device,
          value: item.id,
          isLeaf: false,
        };
      });
      return {
        ...state,
        optData,
      };
    },
    upDeviceList(state, { payload }) {
      const oldData = state.optData;
      for (let i = 0; i < oldData.length; i += 1) {
        if (oldData[i].value === payload.value) {
          oldData[i] = payload;
        }
      }
      return {
        ...state,
        optData: oldData,
      };
    },
    saveTayOpt(state, { payload }) {
      return {
        ...state,
        tagData: payload,
      };
    },
    saveValList(state, { payload }) {
      return {
        ...state,
        data: {
          list: payload.data,
          pagination: payload.paginNation,
        },
      };
    },
  },
};
