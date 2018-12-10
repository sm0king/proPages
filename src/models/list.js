import { queryGetMonitor, queryChangeMonitor, qeuryPanelDtu, queryUpDevice, queryDelProject, queryAddProject, queryCelCalendar, queryTimingViewNode, queryRefreshMonitor, queryUserList, getTimingHoliday, queryPanelUpdate, queryDelPanel, queryTreeCustomize, querytDeviceAndGro, queryDeviceSeltctValue, queryAddDevice, queryNodetype, querySetcalendar, queryFakeList, queryProjectList, queryDeviceList, addDevice, updateDevice, delDevice, addDTU, delDTU, queryDtuList, queryGroup, queryGroName, queryGroDevice, delGroupDevice, queryUpdateDevice } from '../services/api';

export default {
  namespace: 'list',

  state: {
    list: [],
    ProjectList: [],
    dtuList: [],
    group: [],
    groupDevice: [],
    isSet: new Set(),
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation4: [],
    DeviceSelect: [],
    selectValue: [],
    dataDustomize: [],
    dataDevice: [],
    paginNation: {},
    userList: [],
    weekList: [],
    editType: '',
    switchData: [],
    varData: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *getProjectList({ params }, { call, put }) {
      const response = yield call(queryProjectList, params);      
      yield put({
        type: 'saveProjectList',
        payload: Array.isArray(response.data) ? response.data : [],
        paginNation: response.paginNation || {},
      });
    },
    *getDeviceList({ params }, { call, put }) {
      const response = yield call(queryDeviceList, params);
      yield put({
        type: 'saveDeviceList',
        payload: Array.isArray(response.data) ? response.data : [],
        paginNation: response.paginNation || {},
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *edit({ data }, { select, call, put }) {
      const list = yield select(state => state.list.list);
      const dataIndex = list.findIndex(item => item.id === data.id);
      list.splice(dataIndex, 1, data);
      // 上传到服务器
      yield call(queryFakeList, data);
      yield put({
        type: 'queryList',
        payload: list,
      });
    },
    *addDevice({ params }, { call }) {
      const { code } = yield call(addDevice, params);
      return code;
      /* yield put({
        type: 'changeLoading',
        load: true,
      }); */
    },
    *updateDevice({ params }, { call }) {
      const { code } = yield call(updateDevice, params);
      return code;
      /* yield put({
        type: 'changeLoading',
        load: true,
      }); */
    },
    *rmDevice({ id }, { call }) {
      const { code } = yield call(delDevice, id);
      return code;
    },
    *rmGroupDevice({ id }, { call }) {
      yield call(delGroupDevice, [id]);
    },
    *getdtuList({ id }, { call, put }) {
      const response = yield call(queryDtuList, id);
      yield put({
        type: 'saveDtuList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *addDTU({ params }, { call, put }) {
      const response = yield call(addDTU, params);
      yield put({
        type: 'changeLoading',
        load: true,
      });
      return response;
    },
    *upDTU({ params }, { call }) {
      const response = yield call(queryUpDevice, params);
      return response;
    },
    *rmDTU({ id }, { call, put }) {
      yield call(delDTU, id);
      yield put({
        type: 'changeLoading',
        load: true,
      });
    },
    *getGroupList({ data }, { call, put }) {
      const response = yield call(queryGroup, data);
      yield put({
        type: 'saveGroup',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *addGroupName({ data }, { call, put }) {
      const response = yield call(queryGroName, data);
      yield put({
        type: 'saveGroId',
        data: response.data,
      });
      return response;
    },
    *getGroupDevice({ id }, { call, put }) {
      const response = yield call(queryGroDevice, id);
      yield put({
        type: 'saveGroupDevice',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *groAddDevice({ data }, { call, put }) {
      yield call(queryAddDevice, data);
      yield put({
        type: 'changeLoading',
        load: true,
      });
    },
    *groUpdateDevice({ data }, { call, put }) {
      yield call(queryUpdateDevice, data);
      yield put({
        type: 'changeLoading',
        load: true,
      });
    },
    *setCalendar({ data }, { call, put }) {
      const response = yield call(querySetcalendar, data.time);
      if (response.code === 0) {
        yield put({
          type: 'changeCalendar',
          setDate: data.time,
        });
      }
    },
    *celCalendar({ data }, { call, put }) {
      const response = yield call(queryCelCalendar, data.time);
      if (response.code === 0) {
        yield put({
          type: 'celChangeCalendar',
          celDate: data.time,
        });
      }
    },
    *ordinaryNode({ data }, { call, put }) {
      const response = yield call(queryNodetype, data);
      yield put({
        type: 'saveProfile1',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *specifiedNode({ data }, { call, put }) {
      const response = yield call(queryNodetype, data);
      yield put({
        type: 'saveProfile2',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *getDeviceAndGro(data, { call, put }) {
      const response = yield call(querytDeviceAndGro);
      yield put({
        type: 'saveDeviceAndGro',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *getDeviceSeltctValue({ data }, { call, put }) {
      const response = yield call(queryDeviceSeltctValue, data);
      yield put({
        type: 'saveDeviceSeltctValue',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *addProject({ project }, { call, put }) {
      const response = yield call(queryAddProject, project);
      if (response.code === 0) {
        yield put({
          type: 'getProjectList',
          params: { pageNo: 0, pageSize: 10 },
        });
      }
      return response;
    },
    *treeCustomize(data, { call, put }) {
      const response = yield call(queryTreeCustomize);
      yield put({
        type: 'saveTreeCustomize',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    *treeDevice(data, { call, put }) {
      const response = yield call(qeuryPanelDtu, {});
      const payload = Array.isArray(response.data) ? response.data : [];
      payload.map((item) => {
        const itemval = item;
        itemval.panelName = item.deviceName;
        itemval.panelId = item.id;
        itemval.online = item.onlineStatus === 1;
        return itemval;
      });
      yield put({
        type: 'saveTreeDevice',
        payload,
      });
    },
    *delPanel({ id }, { call }) {
      const { code } = yield call(queryDelPanel, id);
      return code;
    },
    *updatePanel({ data }, { call }) {
      const response = yield call(queryPanelUpdate, data);
      return response;
    },
    *getHolidayData({ time }, { call, put }) {
      const { data } = yield call(getTimingHoliday, time);
      yield put({
        type: 'upHolidayData',
        data: data || [],
      });
    },
    *getUserList({ page }, { call, put }) {
      const { data } = yield call(queryUserList, page);
      yield put({
        type: 'saveUserList',
        data,
      });
    },
    *queryTimingViewNode({ time }, { call, put }) {
      const { data } = yield call(queryTimingViewNode, time);
      yield put({
        type: 'saveTimingViewNode',
        data,
      });
    },
    *getDelProject({ id }, { call }) {
      const { code } = yield call(queryDelProject, id);
      return code;
    },
    *changeMonitor({ data }, { call }) {
      const response = yield call(queryChangeMonitor, data);
      return response;
    },
    *getMonitor({ data }, { call }) {
      const response = yield call(queryGetMonitor, data);
      return response;
    },
    getTableData: [function *getTableData({ queryData }, { call, put }) {
      const { data } = yield call(queryRefreshMonitor, queryData);
      yield put({
        type: 'saveTableData',
        data,
      });
    }, { type: 'takeLatest' }],
  },

  reducers: {
    saveTableData(state, { data }) {
      const switchData = [];
      const varData = [];
      if (data) {
        data.forEach((item) => {
          if (item.valueType === 'BV' || item.valueType === 'BI') {
            switchData.push(item);
          } else {
            varData.push(item);
          }
        });
      }
      return {
        ...state,
        switchData,
        varData,
      };
    },
    saveGroId(state, { data }) {
      return {
        ...state,
        groupid: data,
      };
    },
    saveTimingViewNode(state, { data }) {
      return {
        ...state,
        weekList: data,
      };
    },
    saveUserList(state, { data }) {
      return {
        ...state,
        userList: data,
      };
    },
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
    saveProjectList(state, { payload, paginNation }) {
      return {
        ...state,
        list: payload,
        paginNation,
      };
    },
    saveDeviceList(state, { payload, paginNation }) {
      return {
        ...state,
        deviceList: payload,
        paginNation,
      };
    },
    saveDtuList(state, { payload }) {
      return {
        ...state,
        dtuList: payload,
      };
    },
    saveGroup(state, { payload }) {
      return {
        ...state,
        group: payload,
      };
    },
    saveGroupDevice(state, { payload }) {
      return {
        ...state,
        groupDevice: payload,
      };
    },
    changeCalendar(state, { setDate }) {
      return {
        ...state,
        isSet: state.isSet.add(setDate[0]),
      };
    },
    upHolidayData(state, { data }) {
      // t.forEach(s.add, s);
      data.forEach(item => state.isSet.add(item.holidayTime));
      return {
        ...state,
        // isSet: data.forEach(item => state.isSet.add(item)),
      };
    },
    celChangeCalendar(state, { celDate }) {
      state.isSet.delete(celDate[0]);
      return {
        ...state,
      };
    },
    saveTreeCustomize(state, { payload }) {
      return {
        ...state,
        dataDustomize: payload,
      };
    },
    saveTreeDevice(state, { payload }) {
      return {
        ...state,
        dataDevice: payload,
      };
    },
    saveProfile1(state, { payload }) {
      return {
        ...state,
        advancedOperation1: payload,
      };
    },
    saveProfile2(state, { payload }) {
      return {
        ...state,
        advancedOperation2: payload,
      };
    },
    saveDeviceAndGro(state, { payload }) {
      return {
        ...state,
        DeviceSelect: payload,
      };
    },
    queryDeviceSeltctValue(state, { payload }) {
      return {
        ...state,
        selectValue: payload,
      };
    },
    changeSelectTree(state, { editType }) {
      return {
        ...state,
        editType,
      };
    },
  },
};
